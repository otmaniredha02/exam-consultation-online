# ExamReview/middleware.py
from django.http import JsonResponse

EXEMPT_PATHS = {
    '/first-login',
    '/login',
}

class AuthRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path not in EXEMPT_PATHS and not request.user.is_authenticated:
            return JsonResponse({"msg": "Unauthorized access"}, status=401)
        return self.get_response(request)