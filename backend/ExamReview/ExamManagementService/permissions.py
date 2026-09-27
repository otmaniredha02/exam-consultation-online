from functools import wraps
from django.http import JsonResponse


def role_required(*roles):
    """
    Use after AuthRequiredMiddleware has already confirmed the user is
    logged in. This checks WHICH role they're allowed to act as.

    Usage:
        @role_required('professor', 'admin')
        def end_session(request, session_id):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if getattr(request.user, "role", None) not in roles:
                return JsonResponse(
                    {"msg": "Forbidden: insufficient permissions"}, status=403
                )
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator