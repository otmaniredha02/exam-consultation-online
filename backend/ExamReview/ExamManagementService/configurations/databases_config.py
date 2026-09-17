from typing import TYPE_CHECKING
from django.conf import settings
from django.db import connections
from django.db.models import QuerySet


def fetch_backend_database():
    """Import model inside function body to avoid AppRegistryNotReady."""
    from ExamManagementService.models import databases
    return databases.objects.first()

def fetch_database_tables(database_name: str) -> QuerySet:
    """Import model inside function body to avoid AppRegistryNotReady."""
    from ExamManagementService.models import Tables
    return Tables.objects.filter(database_name=database_name)

def addDatabaseBackendToSettings(university_backend: dict):
    settings.DATABASES['university_backend'] = university_backend

def addDatabaseBackendToConnections(university_backend: dict):
    connections.databases['university_backend'] = university_backend