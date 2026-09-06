from rest_framework.routers import DefaultRouter
from django.urls import path, include
from apps.trainers.views import TrainerViewSet, TrainerDashboardView

router = DefaultRouter()
router.register(r"trainers", TrainerViewSet, basename="trainer")

urlpatterns = [
    # Dashboard must come BEFORE router.urls — otherwise "dashboard" gets matched as a {pk}
    path("trainers/dashboard/", TrainerDashboardView.as_view(), name="trainer-dashboard"),
    path("", include(router.urls)),
]
