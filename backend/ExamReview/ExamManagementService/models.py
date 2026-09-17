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