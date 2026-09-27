from functools import wraps
from django.http import JsonResponse


def role_required(*roles):
    """
    Use after AuthRequiredMiddleware has already confirmed the user is
    logged in. Checks group membership (AuthBackend assigns each user to
    a Group matching their role — "student", "professor", or "admin" —
    on every successful login).

    Usage:
        @role_required('professor', 'admin')
        def end_session(request, session_id):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.groups.filter(name__in=roles).exists():
                return JsonResponse(
                    {"msg": "Forbidden: insufficient permissions"}, status=403
                )
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator