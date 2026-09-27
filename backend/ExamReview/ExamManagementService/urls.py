from django.urls import path
from . import views

urlpatterns = [
    # --- Auth (public) ---
    path('first-login', views.first_configuration_login),
    path('login', views.login_user),
    path('logout', views.logout_user),

    # --- Sessions: browsing ---
    path('sessions/list', views.list_review_sessions),
    path('sessions/list/student', views.list_review_sessions_by_student),
    path('sessions/list/professor/<int:professor_id>', views.list_review_sessions_by_professor),
    path('sessions/available', views.list_available_sessions),

    # --- Sessions: create / update / delete / end (professor + admin) ---
    path('sessions/create', views.store_scheduled_review_session),
    path('sessions/update/<int:id>', views.update_review_session_details),
    path('sessions/remove/<int:id>', views.remove_review_session),
    path('sessions/<int:session_id>/end', views.end_session),

    # --- Sessions: joining (student) ---
    path('sessions/<int:session_id>/join', views.join_session),
    path('sessions/<int:session_id>/exam-sheet', views.get_exam_sheet),

    # --- Claims ---
    path('claims/create', views.create_claim),
    path('claims/mine', views.list_my_claims),
    path('claims/professor', views.list_claims_for_professor),
    path('claims/<int:claim_id>/respond', views.respond_to_claim),

    # --- Real-time (SSE) ---
    path('notifications/stream', views.notifications_stream),
    path('sessions/<int:session_id>/participants/stream', views.session_participants_stream),

    # --- Admin: platform config ---
    path('config/platform', views.get_platform_config),
    path('config/platform/update', views.update_platform_config),

    # --- Admin: external/per-university database registry ---
    path('config/databases', views.list_databases),
    path('config/databases/create', views.create_database),
    path('config/databases/<int:database_id>/delete', views.delete_database),
]