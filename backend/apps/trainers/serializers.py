from rest_framework import serializers
from apps.trainers.models import Trainer, TrainerMonthlyPerformance
from apps.accounts.models import User


class TrainerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "mobile", "email", "is_active", "date_joined"]


class TrainerListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    user = TrainerUserSerializer(read_only=True)
    total_members = serializers.SerializerMethodField()

    class Meta:
        model = Trainer
        fields = [
            "id", "user", "specialization", "experience_years", "rating",
            "availability", "total_members", "is_active"
        ]

    def get_total_members(self, obj):
        return obj.assigned_members.count()


class TrainerDetailSerializer(serializers.ModelSerializer):
    """Full serializer for detail/create/update."""
    user = TrainerUserSerializer(read_only=True)
    total_members = serializers.SerializerMethodField()
    current_performance = serializers.SerializerMethodField()

    class Meta:
        model = Trainer
        fields = [
            "id", "user", "specialization", "experience_years",
            "certifications", "bio", "rating", "availability",
            "total_members", "current_performance", "is_active",
        ]

    def get_total_members(self, obj):
        return obj.assigned_members.count()

    def get_current_performance(self, obj):
        from django.utils import timezone
        now = timezone.now()
        perf = TrainerMonthlyPerformance.objects.filter(
            trainer=obj, month=now.month, year=now.year
        ).first()
        if perf:
            return TrainerMonthlyPerformanceSerializer(perf).data
        return None


class TrainerCreateSerializer(serializers.Serializer):
    """Create a trainer + linked user account in one shot."""
    full_name        = serializers.CharField(max_length=150)
    mobile           = serializers.CharField(max_length=15)
    email            = serializers.EmailField(required=False, allow_blank=True)
    password         = serializers.CharField(min_length=8, write_only=True)
    specialization   = serializers.ListField(child=serializers.CharField(), default=list)
    experience_years = serializers.IntegerField(min_value=0, default=0)
    certifications   = serializers.ListField(child=serializers.CharField(), default=list)
    bio              = serializers.CharField(required=False, allow_blank=True)
    availability     = serializers.CharField(required=False, allow_blank=True)

    def validate_mobile(self, value):
        if User.objects.filter(mobile=value).exists():
            raise serializers.ValidationError("A user with this mobile number already exists.")
        return value

    def create(self, validated_data):
        from apps.accounts.models import UserRole
        password = validated_data.pop("password")
        user_fields = {
            "full_name":  validated_data.pop("full_name"),
            "mobile":     validated_data.pop("mobile"),
            "email":      validated_data.pop("email", ""),
            "role":       UserRole.STAFF,
            "is_staff":   False,
        }
        user = User(**user_fields)
        user.set_password(password)
        user.save()

        trainer = Trainer.objects.create(user=user, **validated_data)
        return trainer


class TrainerMonthlyPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerMonthlyPerformance
        fields = [
            "id", "trainer_id", "month", "year", "target", "achieved",
            "difference", "achievement_percentage", "overachievement",
            "remaining", "is_overridden", "override_reason",
            "overridden_by", "overridden_at",
        ]
        read_only_fields = [
            "difference", "achievement_percentage", "overachievement",
            "remaining", "is_overridden", "override_reason",
            "overridden_by", "overridden_at",
        ]


class TargetOverrideSerializer(serializers.Serializer):
    new_target = serializers.IntegerField(min_value=1)
    reason     = serializers.CharField(min_length=5)
