import os
from django.apps import AppConfig
from django.db import models
from django.apps import apps as django_apps


class ExammanagementserviceConfig(AppConfig):
    name = 'ExamManagementService'

    def ready(self):
        if os.environ.get('RUN_MAIN') == 'true':
            self.run_once_startup_logic()

    def run_once_startup_logic(self):
        from ExamManagementService import models as app_models
        from ExamManagementService.configurations.databases_config import (
            addDatabaseBackendToConnections,
            addDatabaseBackendToSettings,
            fetch_backend_database,
            fetch_database_tables
        )
        db = fetch_backend_database()
        if db is None:
            print("error happened: no backend database found")
            return

        print(f"one backend found: {db.name}")

        # ✅ FIXED: Pass db.name instead of db object
        tables = fetch_database_tables(database_name=db.name)
        if not tables.exists():
            print("error happened: no tables found in database")
            return

        university_backend = {
            "ENGINE": db.engine,
            'NAME': db.name,
            'USER': db.user,
            'PASSWORD': db.password,
            'HOST': db.host,
            'PORT': db.port,
            'ATOMIC_REQUESTS': False,
        }

        addDatabaseBackendToSettings(university_backend)
        addDatabaseBackendToConnections(university_backend)

        app_label = self.name.split('.')[-1]

        for table in tables:
            model_class_name = table.table_name.title().replace('_', '')

            if model_class_name in django_apps.all_models.get(app_label.lower(), {}):
                print(f"Skipping {model_class_name}: already registered")
                continue

            attrs = {
                '__module__': 'ExamManagementService.models',
            }

            has_pk = False
            for prop in table.schema:
                col_name = prop['column']
                col_db = prop['column_db']
                prop_type = prop['type']
                is_pk = prop.get('primary_key', False)

                field_kwargs = {'db_column': col_db}
                if is_pk:
                    field_kwargs['primary_key'] = True
                    has_pk = True

                if prop_type == 'integer':
                    attrs[col_name] = models.IntegerField(**field_kwargs)
                elif prop_type == 'varchar':
                    if col_name == "email":
                        attrs[col_name] = models.EmailField(**field_kwargs)
                    else:
                        attrs[col_name] = models.TextField(**field_kwargs)
                else:
                    print(f"warning: unhandled type '{prop_type}' for column '{col_name}' — skipped")

            if not has_pk:
                print(f"warning: no primary_key column defined for table '{table.table_name}'; "
                      f"Django will add an implicit 'id' AutoField")

            meta_attrs = {
                "db_table": table.table_name,
                "managed": False,
                "app_label": app_label,
            }
            attrs['Meta'] = type("Meta", (object,), meta_attrs)

            model_cls = type(model_class_name, (models.Model,), attrs)

            setattr(app_models, model_class_name, model_cls)
            print(f"Successfully injected dynamic model: {model_cls.__name__} (table: '{table.table_name}')")