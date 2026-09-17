from django.test import TestCase
from unittest import skip
from ExamManagementService.configurations.databases_config import addDatabaseBackendToConnections, addDatabaseBackendToSettings, fetch_backend_database, fetch_database_tables
from .models import databases, Tables
from django.conf import settings

class StartupConfigurationTests(TestCase):

    def setUp(self):
        """Runs before every test method to set up isolated test data."""
        self.db_config = databases.objects.create(
            engine='django.db.backends.postgresql',
            name='university_db',
            user='redha',
            password='redharedha',
            host='127.0.0.1',
            port=5432
        )

        self.table_config = Tables.objects.create(
            database_name='university_db',
            table_name='student',
            schema=[
                {"column_db": "id", "column": "id", "type": "integer", "primary_key": True},
                {"column_db": "first_name", "column": "first_name", "type": "varchar"},
                {"column_db": "email", "column": "email", "type": "varchar"}
            ]
        )

        self.university_backend = {
                    "ENGINE": "django.db.backends.postgresql",
                    "NAME": "university_db",
                    "USER": "redha",
                    "PASSWORD": "redharedha",
                    "HOST": "127.0.0.1",
                    "PORT": "5432",
                    "ATOMIC_REQUESTS": False,
                }

        self.professor_table_config = Tables.objects.create(
            database_name='university_db',
            table_name='professor',
            schema=[
                {"column_db": "id", "column": "id", "type": "integer", "primary_key": True},
                {"column_db": "full_name", "column": "full_name", "type": "varchar"},
                {"column_db": "email", "column": "email", "type": "varchar"}
            ]
        )

    def tearDown(self):
        from django.db import connections
        if 'university_backend' in connections.databases:
            del connections.databases['university_backend']

    def test_backend_database_fetch(self):
        db = fetch_backend_database()
        self.assertIsNotNone(db)
        self.assertIsInstance(db, databases)

    def test_database_tables_fetch(self):
        db = fetch_backend_database()
        self.assertIsNotNone(db, "Backend database should exist.")

        tables = fetch_database_tables(db.name)
        self.assertEqual(tables.count(), 2)

    def test_add_database_backend_to_settings(self):
        addDatabaseBackendToSettings(self.university_backend)
        self.assertIn('university_backend', settings.DATABASES)
        self.assertEqual(settings.DATABASES['university_backend'],self.university_backend)

    @skip("not ready for moment")
    def test_add_database_backend_to_connections(self):
        addDatabaseBackendToConnections(self.university_backend)
