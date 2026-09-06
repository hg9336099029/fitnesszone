from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# JWT Auth
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
from apps.accounts.views import CustomTokenObtainPairView, UserProfileView, ChangePasswordView

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # JWT Authentication
    path("api/auth/token/",         CustomTokenObtainPairView.as_view(),  name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(),     name="token_refresh"),
    path("api/auth/token/verify/",  TokenVerifyView.as_view(),      name="token_verify"),
    
    # Profile & Settings
    path("api/auth/me/", UserProfileView.as_view(), name="auth_me"),
    path("api/auth/change-password/", ChangePasswordView.as_view(), name="auth_change_password"),

    # App APIs
    path("api/", include("apps.accounts.urls")),
    path("api/", include("apps.trainers.urls")),
    path("api/reports/", include("apps.reports.urls")),
    path("api/members/", include("apps.members.urls")),
    path("api/memberships/", include("apps.memberships.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
