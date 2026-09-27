from asgiref.sync import sync_to_async
from django.shortcuts import render
from django.http import JsonResponse, HttpRequest, Http404
from django.core.exceptions import BadRequest
from .models import ExamReview
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import login, logout
from ExamReview.auth import AuthBackend
from django.contrib.auth import get_user_model
# Create your views here.


@csrf_exempt
@require_http_methods(['POST'])
def first_configuration_login(request: HttpRequest):
    try:
        body = request.body
        body_dict = json.loads(body)
    except json.JSONDecodeError:
        raise BadRequest("bad request body")
    
    username = body_dict.get("username")
    email = body_dict.get("email")
    password = body_dict.get("password")
    if(username is None or email is None or password is None):
        return BadRequest("email or password is invalid")

    User = get_user_model()
    user_created = User.objects.create_user(username,email,password)

    if(user_created is None):
        return JsonResponse("{'error':'couldn't create admin user'}",500)

    login(request=request,user=user_created)
    return JsonResponse("{'message':'user created!'}",status=200,safe=False)

@csrf_exempt
@require_http_methods(['POST'])
def login_user(request: HttpRequest):
    body = request.body
    if(request.body is None):
        raise BadRequest("Body is empty")        
    try:
        body_dict = json.loads(body)
        email = body_dict.get("email")
        password = body_dict.get("password")
    except json.JSONDecodeError:
        raise BadRequest("Invalid JSON   body")

    if(email is None or password is None):
        raise  BadRequest("Error: email and password are required")
    authbackend = AuthBackend()
    user = authbackend.authenticate(request=request,email=email,password=password)
    if(user is None):
        return JsonResponse({"message":"invalid credentials."},status=400)
    login(request=request,user=user)
    return JsonResponse({"message":"login succesful."},status=200)

@csrf_exempt
@require_http_methods(['POST'])
def logout_user(request: HttpRequest):
    logout(request)
    return  JsonResponse({"message":"logged out."},status=200)

@csrf_exempt
@require_http_methods(['GET'])
def list_review_sessions(request: HttpRequest):
    if(not request.user.is_authenticated):
        return JsonResponse({"msg":"Unauthorized access"},status=401)
    
    filter = {}
    for param in request.GET.keys():
        filter[param] = request.GET.get(param)  
    review_sessions = list(ExamReview.objects.filter(**filter).values())
    return JsonResponse(review_sessions,safe=False)


@csrf_exempt
@require_http_methods(['GET'])
def list_review_sessions_by_student(request: HttpRequest):
    lvl = request.GET.get("level")
    sp = request.GET.get("speciality")
    if(sp is None or lvl is None):
        raise BadRequest("must provide level and speciality")
    review_sessions = list(ExamReview.objects.filter(level=lvl,speciality=sp).values())
    return JsonResponse(review_sessions,safe=False)

@csrf_exempt
@require_http_methods(['GET'])
def list_review_sessions_by_professor(request: HttpRequest,professor_id:int):
    if(professor_id is None):
        raise BadRequest("must provide professor_id")
    review_sessions = list(ExamReview.objects.filter(professor_id=professor_id).values())
    return JsonResponse(review_sessions,safe=False)

@csrf_exempt
@require_http_methods(['POST'])
def store_scheduled_review_session(request: HttpRequest):
    # 1 read the body
    body = request.body
    body_dict = json.loads(body)
    # 2 create objet and save
    result = ExamReview.objects.create(**body_dict)
    if(result is None):
        raise BadRequest("Unable to save scheduled session.")

    return JsonResponse({"status":True},safe=False)


@csrf_exempt
@require_http_methods(['PUT','PATCH'])
def update_review_session_details(request: HttpRequest,id: int):
    body = request.body
    body_dict = json.loads(body)
    try:
        updated_records = ExamReview.objects.filter(id=id).update(**body_dict)
        if(updated_records == 0):
            return JsonResponse({"message": "No update done."},safe=False)
        return JsonResponse({"status":True},safe=False)
    except ExamReview.DoesNotExist:
        raise Http404("The record to be updated doesn't exists.")

@csrf_exempt
@require_http_methods(['POST'])
def remove_review_session(request: HttpRequest,id: int):
    try:
        review_session = ExamReview.objects.get(id=id)
        review_session.delete()
        return JsonResponse({"status":True},safe=False)
    except ExamReview.DoesNotExist:
        raise Http404("The record to be deleted doesn't exists.")