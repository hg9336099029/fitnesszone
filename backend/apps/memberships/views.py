from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from apps.memberships.models import MembershipPlan, Membership
from apps.memberships.serializers import MembershipPlanSerializer, MembershipSerializer

class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = [AllowAny]

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [AllowAny]
