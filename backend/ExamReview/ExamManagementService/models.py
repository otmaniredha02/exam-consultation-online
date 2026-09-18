from django.db import models

class databases(models.Model):
    engine =  models.TextField()
    name = models.TextField()
    user = models.TextField()
    password = models.TextField()
    host = models.TextField(max_length=15)
    port = models.IntegerField(max_length=5)

class Tables(models.Model):
    database_name = models.TextField()
    table_name = models.TextField()
    schema = models.JSONField()
    

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