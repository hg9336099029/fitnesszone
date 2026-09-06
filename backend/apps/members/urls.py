from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, MemberDashboardView, MemberGoalViewSet, BodyMeasurementViewSet

router = DefaultRouter()
router.register(r'goals', MemberGoalViewSet, basename='member-goals')
router.register(r'measurements', BodyMeasurementViewSet, basename='member-measurements')
router.register(r'', MemberViewSet, basename='member')

urlpatterns = [
    path('dashboard/', MemberDashboardView.as_view(), name='member-dashboard'),
    path('', include(router.urls)),
]
