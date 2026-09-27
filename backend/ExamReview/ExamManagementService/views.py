import json

from django.contrib.auth import login, logout, get_user_model
from django.core.exceptions import BadRequest
from django.http import JsonResponse, HttpRequest, Http404, StreamingHttpResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from ExamReview.auth import AuthBackend
from .models import ExamReview, ExamNotes, SessionParticipant, Claims, Notification, PlatformConfig, Databases
from .permissions import role_required
from .realtime import broadcaster, sse_stream

# ============================================================
# Auth (public — exempt from AuthRequiredMiddleware)
# ============================================================

@csrf_exempt
@require_http_methods(['POST'])
def first_configuration_login(request: HttpRequest):
    try:
        body = request.body
        body_dict = json.loads(body)
    except json.JSONDecodeError:
        raise JsonResponse({"message":"bad request body"},stats=400)

    username = body_dict.get("username")
    email = body_dict.get("email")
    password = body_dict.get("password")
    if username is None or email is None or password is None:
        return JsonResponse({"message":"email or password is invalid"},status=400)

    User = get_user_model()
    user_created = User.objects.create_user(username, email, password)

    if user_created is None:
        return JsonResponse({"error": "couldn't create admin user"}, status=500)

    login(request=request, user=user_created)
    return JsonResponse({"message": "user created!"}, status=200, safe=False)


@csrf_exempt
@require_http_methods(['POST'])
def login_user(request: HttpRequest):
    body = request.body
    if request.body is None:
        raise BadRequest("Body is empty")
    try:
        body_dict = json.loads(body)
        email = body_dict.get("email")
        password = body_dict.get("password")
    except json.JSONDecodeError:
        raise BadRequest("Invalid JSON body")

    if email is None or password is None:
        raise BadRequest("Error: email and password are required")

    authbackend = AuthBackend()
    user = authbackend.authenticate(request=request, email=email, password=password)
    if user is None:
        return JsonResponse({"message": "invalid credentials."}, status=400)

    login(request=request, user=user)
    return JsonResponse({"message": "login succesful."}, status=200)


@csrf_exempt
@require_http_methods(['POST'])
def logout_user(request: HttpRequest):
    logout(request)
    return JsonResponse({"message": "logged out."}, status=200)


# ============================================================
# Everything below is protected by AuthRequiredMiddleware
# (authentication) + role_required (authorization)
# ============================================================

# ---------- Sessions: browsing / listing ----------

@require_http_methods(['GET'])
def list_review_sessions(request: HttpRequest):
    filter = {}
    for param in request.GET.keys():
        filter[param] = request.GET.get(param)
    review_sessions = list(ExamReview.objects.filter(**filter).values())
    return JsonResponse(review_sessions, safe=False)


@require_http_methods(['GET'])
def list_review_sessions_by_student(request: HttpRequest):
    lvl = request.GET.get("level")
    sp = request.GET.get("speciality")
    if sp is None or lvl is None:
        raise BadRequest("must provide level and speciality")
    review_sessions = list(ExamReview.objects.filter(level=lvl, speciality=sp).values())
    return JsonResponse(review_sessions, safe=False)


@require_http_methods(['GET'])
def list_review_sessions_by_professor(request: HttpRequest, professor_id: int):
    if professor_id is None:
        raise BadRequest("must provide professor_id")
    review_sessions = list(ExamReview.objects.filter(professor_id=professor_id).values())
    return JsonResponse(review_sessions, safe=False)


@require_http_methods(['GET'])
@role_required('student')
def list_available_sessions(request: HttpRequest):
    """Sessions a student can still join: matches their level/speciality,
    still open, and they haven't already joined."""
    student = request.user
    sessions = (
        ExamReview.objects
        .filter(status="scheduled", level=student.level, speciality=student.speciality)
        .exclude(participants__student_id=student.id)
        .values()
    )
    return JsonResponse(list(sessions), safe=False)


# ---------- Sessions: create / update / delete / end ----------
# Restricted to professor or admin, and gated by AuthRequiredMiddleware.

@csrf_exempt
@require_http_methods(['POST'])
@role_required('professor', 'admin')
def store_scheduled_review_session(request: HttpRequest):
    body = request.body
    body_dict = json.loads(body)
    result = ExamReview.objects.create(**body_dict)
    if result is None:
        raise BadRequest("Unable to save scheduled session.")
    return JsonResponse({"status": True}, safe=False)


@csrf_exempt
@require_http_methods(['PUT', 'PATCH'])
@role_required('professor', 'admin')
def update_review_session_details(request: HttpRequest, id: int):
    body = request.body
    body_dict = json.loads(body)
    try:
        updated_records = ExamReview.objects.filter(id=id).update(**body_dict)
        if updated_records == 0:
            return JsonResponse({"message": "No update done."}, safe=False)
        return JsonResponse({"status": True}, safe=False)
    except ExamReview.DoesNotExist:
        raise Http404("The record to be updated doesn't exists.")


@csrf_exempt
@require_http_methods(['POST'])
@role_required('professor', 'admin')
def remove_review_session(request: HttpRequest, id: int):
    try:
        review_session = ExamReview.objects.get(id=id)
        review_session.delete()
        return JsonResponse({"status": True}, safe=False)
    except ExamReview.DoesNotExist:
        raise Http404("The record to be deleted doesn't exists.")


@csrf_exempt
@require_http_methods(['POST'])
@role_required('professor', 'admin')
def end_session(request: HttpRequest, session_id: int):
    try:
        session = ExamReview.objects.get(id=session_id)
    except ExamReview.DoesNotExist:
        raise Http404("Session not found.")

    is_professor_only = request.user.groups.filter(name="professor").exists() and not request.user.groups.filter(name="admin").exists()
    if is_professor_only and session.professor_id != request.user.id:
        return JsonResponse({"msg": "You can only end your own sessions."}, status=403)

    session.status = "ended"
    session.save()

    broadcaster.publish(
        channel=f"session:{session_id}:participants",
        event="session_ended",
        data={"session_id": session_id},
    )
    for participant in session.participants.all():
        Notification.objects.create(
            recipient_id=participant.student_id,
            message=f"Session for {session.module} has ended.",
            notif_type="session_ended",
        )
        broadcaster.publish(
            channel=f"user:{participant.student_id}",
            event="notification",
            data={"type": "session_ended", "session_id": session_id},
        )

    return JsonResponse({"status": True}, safe=False)


# ---------- Sessions: joining ----------

@csrf_exempt
@require_http_methods(['POST'])
@role_required('student')
def join_session(request: HttpRequest, session_id: int):
    try:
        session = ExamReview.objects.get(id=session_id, status="scheduled")
    except ExamReview.DoesNotExist:
        raise Http404("Session not found or not open for joining.")

    participant, created = SessionParticipant.objects.get_or_create(
        session=session, student_id=request.user.id,
    )
    if not created:
        return JsonResponse({"message": "Already joined."}, status=200)

    broadcaster.publish(
        channel=f"session:{session_id}:participants",
        event="student_joined",
        data={
            "session_id": session_id,
            "student_id": request.user.id,
            "student_name": f"{request.user.first_name} {request.user.last_name}",
            "joined_at": participant.joined_at.isoformat(),
        },
    )
    return JsonResponse({"status": True}, status=201)


# ---------- Exam sheet + correction, side by side ----------

@require_http_methods(['GET'])
@role_required('student')
def get_exam_sheet(request: HttpRequest, session_id: int):
    try:
        session = ExamReview.objects.get(id=session_id)
    except ExamReview.DoesNotExist:
        raise Http404("Session not found.")

    # ExamNotes has no direct link to a session, only student_id + module.
    # Matched on that basis, most recent first. NOTE: if a student has notes
    # for the same module across multiple terms/sessions, this can't tell
    # them apart — add an exam_review FK to ExamNotes to fix that properly.
    note = (
        ExamNotes.objects
        .filter(student_id=request.user.id, module=session.module)
        .order_by('-id')
        .first()
    )
    if note is None:
        raise Http404("No exam note found for you in this session's module.")

    return JsonResponse({
        "exam_copy_url": note.exam_copy,
        "correction_sheet_url": session.correction_sheet,
        "grade": note.grade,
    })


# ---------- Claims ----------

@csrf_exempt
@require_http_methods(['POST'])
@role_required('student')
def create_claim(request: HttpRequest):
    body_dict = json.loads(request.body)
    exam_review_id = body_dict.get("exam_review_id")
    exercise = body_dict.get("exercise")
    question = body_dict.get("question")
    claim_text = body_dict.get("claim")
    if not all([exam_review_id, exercise, question, claim_text]):
        raise BadRequest("exam_review_id, exercise, question and claim are required")

    try:
        session = ExamReview.objects.get(id=exam_review_id)
    except ExamReview.DoesNotExist:
        raise Http404("Session not found.")

    claim = Claims.objects.create(
        student_id=request.user.id,
        professor_id=session.professor_id,
        exam_review=session,
        exercice=exercise,
        question=question,
        claim=claim_text,
        status="pending",
    )

    Notification.objects.create(
        recipient_id=session.professor_id,
        message=f"New claim from {request.user.first_name} on {session.module}",
        notif_type="claim",
    )
    broadcaster.publish(
        channel=f"user:{session.professor_id}",
        event="notification",
        data={"type": "new_claim", "claim_id": claim.id, "exam_review_id": session.id},
    )
    return JsonResponse({"status": True, "claim_id": claim.id}, status=201)


@require_http_methods(['GET'])
@role_required('student')
def list_my_claims(request: HttpRequest):
    claims = list(Claims.objects.filter(student_id=request.user.id).values())
    return JsonResponse(claims, safe=False)


@require_http_methods(['GET'])
@role_required('professor')
def list_claims_for_professor(request: HttpRequest):
    claims = list(Claims.objects.filter(professor_id=request.user.id).values())
    return JsonResponse(claims, safe=False)


@csrf_exempt
@require_http_methods(['POST'])
@role_required('professor')
def respond_to_claim(request: HttpRequest, claim_id: int):
    body_dict = json.loads(request.body)
    decision = body_dict.get("decision")  # "accept" or "reject"
    response_text = body_dict.get("response", "")
    if decision not in ("accept", "reject"):
        raise BadRequest("decision must be 'accept' or 'reject'")

    try:
        claim = Claims.objects.get(id=claim_id, professor_id=request.user.id)
    except Claims.DoesNotExist:
        raise Http404("Claim not found.")

    claim.status = "approved" if decision == "accept" else "rejected"
    claim.response = response_text
    claim.save()

    Notification.objects.create(
        recipient_id=claim.student_id,
        message=f"Your claim was {claim.status} by the professor.",
        notif_type="claim_update",
    )
    broadcaster.publish(
        channel=f"user:{claim.student_id}",
        event="notification",
        data={"type": "claim_update", "claim_id": claim.id, "status": claim.status},
    )
    return JsonResponse({"status": True}, safe=False)


# ---------- Real-time streams (SSE) ----------

@require_http_methods(['GET'])
def notifications_stream(request: HttpRequest):
    """Generic personal notification feed — works for student, professor, or admin."""
    channel = f"user:{request.user.id}"
    response = StreamingHttpResponse(sse_stream(channel), content_type="text/event-stream")
    response["Cache-Control"] = "no-cache"
    response["X-Accel-Buffering"] = "no"  # avoid proxy buffering (e.g. nginx)
    return response


@require_http_methods(['GET'])
@role_required('professor', 'admin')
def session_participants_stream(request: HttpRequest, session_id: int):
    """Live feed of students joining a given session."""
    channel = f"session:{session_id}:participants"
    response = StreamingHttpResponse(sse_stream(channel), content_type="text/event-stream")
    response["Cache-Control"] = "no-cache"
    response["X-Accel-Buffering"] = "no"
    return response


# ---------- Admin: platform config ----------

@require_http_methods(['GET'])
@role_required('admin')
def get_platform_config(request: HttpRequest):
    config = PlatformConfig.objects.first()
    if config is None:
        return JsonResponse({})
    return JsonResponse({
        "university_name": config.university_name,
        "university_logo_url": config.university_logo_url,
        "grade_system": config.grade_system,
    })


@csrf_exempt
@require_http_methods(['PUT', 'PATCH'])
@role_required('admin')
def update_platform_config(request: HttpRequest):
    body_dict = json.loads(request.body)
    config, _ = PlatformConfig.objects.get_or_create(id=1)
    for field in ("university_name", "university_logo_url", "grade_system"):
        if field in body_dict:
            setattr(config, field, body_dict[field])
    config.save()
    return JsonResponse({"status": True})


# ---------- Admin: external/per-university database registry ----------

@require_http_methods(['GET'])
@role_required('admin')
def list_databases(request: HttpRequest):
    # Password excluded from the response on purpose.
    databases = list(Database.objects.all().values('id', 'engine', 'name', 'user', 'host', 'port'))
    return JsonResponse(databases, safe=False)


@csrf_exempt
@require_http_methods(['POST'])
@role_required('admin')
def create_database(request: HttpRequest):
    """
    Registers connection details for an external/per-university database.
    NOTE: this only stores the config row — Django reads DATABASES from
    settings.py at process startup, so creating a row here does not by
    itself make the app start querying that database. Wiring an actual
    dynamic-DB router/connection is a separate, larger piece of work.
    """
    body_dict = json.loads(request.body)
    required = ('engine', 'name', 'user', 'password', 'host', 'port')
    if not all(k in body_dict for k in required):
        raise BadRequest(f"required fields: {', '.join(required)}")
    db = Database.objects.create(**{k: body_dict[k] for k in required})
    return JsonResponse({"status": True, "id": db.id}, status=201)


@csrf_exempt
@require_http_methods(['DELETE'])
@role_required('admin')
def delete_database(request: HttpRequest, database_id: int):
    try:
        db = Database.objects.get(id=database_id)
    except Database.DoesNotExist:
        raise Http404("Database config not found.")
    db.delete()
    return JsonResponse({"status": True})