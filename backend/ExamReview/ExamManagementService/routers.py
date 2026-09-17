class UniversityBackendRouter:
    route_app_labels = {'ExamManagementService'}  # or track which models are "external" more precisely

    def db_for_read(self, model, **hints):
        if getattr(model, '_use_university_backend', False):
            return 'university_backend'
        return None

    def db_for_write(self, model, **hints):
        return self.db_for_read(model, **hints)