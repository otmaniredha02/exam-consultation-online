from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.apps import apps
import re
ADMIN_PATTERN = '[A-Za-z0-9._%+-]+@admin\\.someuniv\\.some'
STUDENT_PATTERN = '[A-Za-z0-9._%+-]+@stu\\.someuniv\\.some'
PROFESSOR_PATTERN = '[A-Za-z0-9._%+-]+@someuniv\\.some'
class AuthBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        if not email or not password:
            return None
        else:
            if re.fullmatch(ADMIN_PATTERN, email):
                UserModel = get_user_model()
                try:
                    user = UserModel.objects.get(email=email)
                except UserModel.DoesNotExist:
                    return
                if user.check_password(password):
                    return user
            else:
                if re.fullmatch(STUDENT_PATTERN, email):
                    try:
                        Student = apps.get_model('ExamManagementService', 'Student')
                    except LookupError:
                        return
                    try:
                        student = Student.objects.get(email=email)
                    except Student.DoesNotExist:
                        return
                    if password != student.password:
                        return
                    else:
                        return self.get_or_create_django_user(student, 'student')
                else:
                    if re.fullmatch(PROFESSOR_PATTERN, email):
                        try:
                            Professor = apps.get_model('ExamManagementService', 'Professor')
                        except LookupError:
                            return
                        try:
                            professor = Professor.objects.get(email=email)
                        except Professor.DoesNotExist:
                            return None
                        if password != professor.password:
                            return
                        else:
                            return self.get_or_create_django_user(professor, 'professor')
    def get_or_create_django_user(self, external_user, role):
        UserModel = get_user_model()
        user, created = UserModel.objects.get_or_create(email=external_user.email, defaults={'first_name': getattr(external_user, 'first_name', ''), 'last_name': getattr(external_user, 'last_name', '')})
        return user
    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None