from rest_framework import serializers
from .models import Member
from apps.accounts.models import User, UserRole

class MemberSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    mobile = serializers.CharField(source='user.mobile', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    attendance_streak = serializers.IntegerField(read_only=True)
    
    # We'll pull these from the active membership if any
    membership_level = serializers.SerializerMethodField()
    membership_status = serializers.SerializerMethodField()
    renewal_date = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            'id', 'member_id', 'full_name', 'mobile', 'email', 'date_of_birth', 'gender',
            'city', 'state', 'pincode', 'emergency_contact_name', 'emergency_contact_mobile',
            'membership_level', 'membership_status', 'attendance_streak', 'renewal_date', 'created_at'
        ]

    def _get_active_membership(self, obj):
        if not hasattr(self, '_active_memberships'):
            self._active_memberships = {}
        if obj.id not in self._active_memberships:
            active_membership = obj.memberships.filter(status='active').first()
            if not active_membership:
                # Fallback to the latest pending/expired
                active_membership = obj.memberships.first()
            self._active_memberships[obj.id] = active_membership
        return self._active_memberships[obj.id]

    def get_membership_level(self, obj):
        membership = self._get_active_membership(obj)
        return membership.plan.level if membership else None

    def get_membership_status(self, obj):
        membership = self._get_active_membership(obj)
        return membership.status if membership else None

    def get_renewal_date(self, obj):
        membership = self._get_active_membership(obj)
        return membership.end_date if membership else None


class MemberCreateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    mobile = serializers.CharField(write_only=True)

    class Meta:
        model = Member
        fields = [
            'full_name', 'email', 'mobile', 'date_of_birth', 'gender',
            'city', 'state', 'pincode', 'emergency_contact_name', 'emergency_contact_mobile'
        ]

    def create(self, validated_data):
        # Extract User fields
        full_name = validated_data.pop('full_name')
        email = validated_data.pop('email', '')
        mobile = validated_data.pop('mobile')
        
        # Check if user with mobile already exists
        if User.objects.filter(mobile=mobile).exists():
            raise serializers.ValidationError({"mobile": "A user with this mobile number already exists."})
            
        # Create User
        user = User.objects.create_user(
            email=email,
            mobile=mobile,
            full_name=full_name,
            password=mobile, # Use mobile number as temporary password
            role=UserRole.MEMBER
        )
        
        # Create Member
        member = Member.objects.create(user=user, **validated_data)
        return member


from .models import MemberGoal, BodyMeasurement, MemberAchievement

class MemberGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberGoal
        fields = [
            'id', 'member', 'type', 'title', 'current_value',
            'target_value', 'unit', 'deadline', 'is_achieved',
            'progress_percentage', 'created_at'
        ]
        read_only_fields = ['is_achieved', 'progress_percentage', 'created_at', 'member']

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        if instance.current_value >= instance.target_value and instance.target_value > 0:
            instance.is_achieved = True
        instance.save()
        return instance


class BodyMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyMeasurement
        fields = '__all__'
        read_only_fields = ['member']


class MemberAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberAchievement
        fields = '__all__'
