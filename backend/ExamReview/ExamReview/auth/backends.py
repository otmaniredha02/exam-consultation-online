import re

from django.apps import apps
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import Group, Permission

ADMIN_PATTERN = r'[A-Za-z0-9._%+-]+@admin\.someuniv\.some'
STUDENT_PATTERN = r'[A-Za-z0-9._%+-]+@stu\.someuniv\.some'
PROFESSOR_PATTERN = r'[A-Za-z0-9._%+-]+@someuniv\.some'

# Which permissions each role's Group should carry. add_/change_/delete_/view_
# are auto-created by Django for every model; the others (manage_platform,
# manage_databases, respond_claims) are custom permissions declared in each
# model's Meta.permissions in models.py.
ROLE_PERMISSIONS = {
    "student": [
        ("ExamManagementService", "view_examreview"),
        ("ExamManagementService", "add_claims"),
        ("ExamManagementService", "view_claims"),
    ],
    "professor": [
        ("ExamManagementService", "add_examreview"),
        ("ExamManagementService", "change_examreview"),
        ("ExamManagementService", "delete_examreview"),
        ("ExamManagementService", "view_examreview"),
        ("ExamManagementService", "view_claims"),
        ("ExamManagementService", "respond_claims"),
    ],
    "admin": [
        ("ExamManagementService", "add_examreview"),
        ("ExamManagementService", "change_examreview"),
        ("ExamManagementService", "delete_examreview"),
        ("ExamManagementService", "view_examreview"),
        ("ExamManagementService", "view_claims"),
        ("ExamManagementService", "respond_claims"),
        ("ExamManagementService", "manage_platform"),
        ("ExamManagementService", "manage_databases"),
    ],
}


def _get_or_create_role_group(role: str) -> Group:
    """
    Ensures a Group named `role` exists and carries exactly the permissions
    listed in ROLE_PERMISSIONS. Safe to call on every login: get_or_create
    plus a set comparison make repeated calls a no-op after the first.
    """
    group, _ = Group.objects.get_or_create(name=role)

    wanted_perms = []
    for app_label, codename in ROLE_PERMISSIONS.get(role, []):
        try:
            wanted_perms.append(
                Permission.objects.get(content_type__app_label=app_label, codename=codename)
            )
        except Permission.DoesNotExist:
            # Custom permission not migrated yet — skip rather than fail login.
            continue

    current_ids = set(group.permissions.values_list('id', flat=True))
    wanted_ids = {p.id for p in wanted_perms}
    if current_ids != wanted_ids:
        group.permissions.set(wanted_perms)

    return group


class AuthBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        if not email or not password:
            return None

        if re.fullmatch(ADMIN_PATTERN, email):
            UserModel = get_user_model()
            try:
                user = UserModel.objects.get(email=email)
            except UserModel.DoesNotExist:
                return None
            if user.check_password(password):
                self._assign_role(user, "admin")
                return user
            return None

        if re.fullmatch(STUDENT_PATTERN, email):
            try:
                Student = apps.get_model('ExamManagementService', 'Student')
            except LookupError:
                return None
            try:
                student = Student.objects.get(email=email)
            except Student.DoesNotExist:
                return None
            if password != student.password:
                return None
            return self.get_or_create_django_user(student, 'student')

        if re.fullmatch(PROFESSOR_PATTERN, email):
            try:
                Professor = apps.get_model('ExamManagementService', 'Professor')
            except LookupError:
                return None
            try:
                professor = Professor.objects.get(email=email)
            except Professor.DoesNotExist:
                return None
            if password != professor.password:
                return None
            return self.get_or_create_django_user(professor, 'professor')

        return None

    def get_or_create_django_user(self, external_user, role):
        UserModel = get_user_model()
        # NOTE: default User.username is unique + required. Leaving it out of
        # `defaults` means every new user gets username="" and the second
        # such user then fails with a UNIQUE constraint error. Using the
        # email as the username keeps it unique and avoids that crash.
        user, created = UserModel.objects.get_or_create(
            email=external_user.email,
            defaults={
                'username': external_user.email[:150],
                'first_name': getattr(external_user, 'first_name', ''),
                'last_name': getattr(external_user, 'last_name', ''),
            },
        )
        self._assign_role(user, role)
        return user

    def _assign_role(self, user, role):
        group = _get_or_create_role_group(role)
        if not user.groups.filter(pk=group.pk).exists():
            user.groups.add(group)

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None