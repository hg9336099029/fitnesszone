from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Override the automatically generated field so email lengths are allowed
    mobile = serializers.CharField()

    def validate(self, attrs):
        mobile_or_email = attrs.get('mobile')
        password = attrs.get('password')

        if not mobile_or_email or not password:
            raise serializers.ValidationError({"detail": "Must include mobile/email and password."})

        try:
            if '@' in mobile_or_email:
                user = User.objects.get(email=mobile_or_email)
            else:
                user = User.objects.get(mobile=mobile_or_email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "Account not found with this mobile number or email."})

        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Incorrect password. Please try again."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is inactive."})

        self.user = user
        
        # Generate tokens
        refresh = self.get_token(user)

        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        role = "member"
        if user.role == "admin":
            role = "admin"
        elif user.role == "staff":
            if hasattr(user, "trainer_profile"):
                role = "trainer"
            else:
                role = "staff"
        elif user.role == "member":
            role = "member"

        data["role"] = role
        return data


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "mobile", "email", "is_active", "date_joined"]


class StaffCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    mobile = serializers.CharField(max_length=15)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_mobile(self, value):
        if User.objects.filter(mobile=value).exists():
            raise serializers.ValidationError("A user with this mobile number already exists.")
        return value

    def create(self, validated_data):
        from apps.accounts.models import UserRole
        password = validated_data.pop("password")
        user = User(
            role=UserRole.STAFF,
            is_staff=False,
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "mobile", "email", "role"]
        read_only_fields = ["id", "role"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
