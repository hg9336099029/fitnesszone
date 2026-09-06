from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from apps.accounts.models import UserRole
from apps.accounts.serializers import StaffSerializer, StaffCreateSerializer

User = get_user_model()

class StaffViewSet(viewsets.ModelViewSet):
    """
    CRUD for general Staff members (role=STAFF, not necessarily trainers).
    """
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # We define general staff as UserRole.STAFF who do NOT have a trainer profile.
        # Wait, the user didn't request to filter trainers out, but we can do it to avoid duplication.
        # Let's just return all STAFF for now, they can see trainers in the list too, or we filter trainers.
        return User.objects.filter(role=UserRole.STAFF, trainer_profile__isnull=True).order_by("full_name")

    def get_serializer_class(self):
        if self.action == "create":
            return StaffCreateSerializer
        return StaffSerializer

    def create(self, request, *args, **kwargs):
        serializer = StaffCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(StaffSerializer(user).data, status=status.HTTP_201_CREATED)

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from apps.accounts.serializers import UserProfileSerializer, ChangePasswordSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        if not user.check_password(serializer.validated_data.get("old_password")):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(serializer.validated_data.get("new_password"))
        user.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)
