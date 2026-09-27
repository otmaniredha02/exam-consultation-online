from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


# ============================================================
# External / per-university database registry
# (admin-managed — see "manage backend database used" feature)
# ============================================================

class Database(models.Model):
    """Connection details for an external/per-university database."""
    engine = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    user = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    # Hostnames and IPv6 literals can exceed 15 chars (that limit only fits
    # a dotted-quad IPv4 address), so this is widened rather than truncating
    # valid hosts.
    host = models.CharField(max_length=255)
    # IntegerField(max_length=...) was a no-op — max_length isn't enforced
    # on integer fields. A real port range check via validators instead.
    port = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(65535)]
    )

    def __str__(self):
        return f"{self.name}@{self.host}:{self.port}"


class Table(models.Model):
    database = models.ForeignKey(Database, on_delete=models.CASCADE, related_name="tables")
    table_name = models.CharField(max_length=255)
    schema = models.JSONField()

    def __str__(self):
        return self.table_name


# ============================================================
# Core domain models
# ============================================================

class ExamNotes(models.Model):
    # Foreign keys stored as raw IDs to support external/dynamic university databases
    student_id = models.IntegerField()
    module = models.CharField(max_length=255)
    grade = models.DecimalField(max_digits=5, decimal_places=2)
    exam_copy = models.URLField(max_length=500, blank=True, null=True)  # exam copy (url)

    def __str__(self):
        return f"Student {self.student_id} - {self.module}: {self.grade}"


class ExamReview(models.Model):
    professor_id = models.IntegerField()
    module = models.CharField(max_length=255)
    speciality = models.CharField(max_length=255)
    level = models.CharField(max_length=100)
    date = models.DateTimeField()
    duration = models.DurationField(help_text="Duration of the exam review session")
    correction_sheet = models.URLField(max_length=500, blank=True, null=True)  # correction sheet (url)
    gradings = models.JSONField(default=dict, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        default="scheduled",
        choices=[("scheduled", "Scheduled"), ("ended", "Ended")],
    )

    def __str__(self):
        return f"{self.module} ({self.level} - {self.speciality})"


class Claims(models.Model):
    claim = models.TextField()
    response = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=50,
        default='pending',
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    # External entities references
    student_id = models.IntegerField()
    professor_id = models.IntegerField(blank=True, null=True)

    # Internal relationship to ExamReview
    exam_review = models.ForeignKey(
        ExamReview,
        on_delete=models.CASCADE,
        related_name='claims'
    )

    exercice = models.CharField(max_length=100, blank=True, null=True)
    question = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Claim #{self.id} - Student {self.student_id} ({self.status})"


# ============================================================
# New models (session joining / notifications / platform config)
# Kept consistent with the raw-integer-ID pattern above, since
# actual users live in an external per-university database.
# ============================================================

class SessionParticipant(models.Model):
    session = models.ForeignKey(ExamReview, on_delete=models.CASCADE, related_name="participants")
    student_id = models.IntegerField()
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("session", "student_id")


class Notification(models.Model):
    recipient_id = models.IntegerField()
    message = models.CharField(max_length=500)
    notif_type = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class PlatformConfig(models.Model):
    """Singleton row (id=1) holding admin-managed platform settings."""
    university_name = models.CharField(max_length=255, blank=True)
    university_logo_url = models.URLField(blank=True)
    grade_system = models.JSONField(default=dict, blank=True)