from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.memberships.views import MembershipPlanViewSet, MembershipViewSet

router = DefaultRouter()
router.register(r'plans', MembershipPlanViewSet, basename='membership-plan')
router.register(r'', MembershipViewSet, basename='membership')

urlpatterns = [
    path('', include(router.urls)),
]
