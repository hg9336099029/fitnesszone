from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Member
from .serializers import MemberSerializer, MemberCreateSerializer
from django.db.models import Q

class MemberViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__full_name', 'user__mobile', 'user__email', 'member_id']
    ordering_fields = ['created_at', 'user__full_name']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Member.objects.select_related('user').prefetch_related('memberships__plan')
        
        # Apply custom filters for level and status
        level = self.request.query_params.get('level', None)
        status = self.request.query_params.get('status', None)
        
        if level:
            queryset = queryset.filter(memberships__plan__level=level, memberships__status='active')
            
        if status:
            if status == 'active':
                queryset = queryset.filter(memberships__status='active')
            else:
                # If filtering by non-active, we want members whose LATEST membership is of that status
                # Or just basic filtering for now to get it working end-to-end
                queryset = queryset.filter(memberships__status=status)
                
        return queryset.distinct()

    def get_serializer_class(self):
        if self.action in ['create']:
            return MemberCreateSerializer
        return MemberSerializer

    from rest_framework.decorators import action
    from rest_framework.response import Response
    from rest_framework import status

    @action(detail=True, methods=['post'])
    def assign_plan(self, request, pk=None):
        import datetime
        from apps.memberships.models import Membership, MembershipPlan
        
        member = self.get_object()
        plan_id = request.data.get('plan_id')
        start_date = request.data.get('start_date')
        
        if not plan_id or not start_date:
            return Response({"error": "plan_id and start_date are required."}, status=400)
            
        try:
            plan = MembershipPlan.objects.get(id=plan_id)
        except MembershipPlan.DoesNotExist:
            return Response({"error": "Invalid plan_id."}, status=404)
            
        start = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
        end = start + datetime.timedelta(days=plan.duration_days)
        
        # Deactivate previous active memberships
        member.memberships.filter(status='active').update(status='expired')
        
        membership = Membership.objects.create(
            member=member,
            plan=plan,
            start_date=start,
            end_date=end,
            status='active'
        )
        
        return Response({"status": "Membership assigned successfully", "membership_id": membership.id}, status=200)


from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MemberGoal, BodyMeasurement, MemberAchievement
from .serializers import MemberGoalSerializer, BodyMeasurementSerializer, MemberAchievementSerializer

class MemberDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            member = request.user.member_profile
        except (Member.DoesNotExist, AttributeError):
            return Response({"error": "Member profile not found. Please log in as a member."}, status=404)

        # 1. Member Basic Info
        member_data = MemberSerializer(member).data

        # 2. Membership
        active_membership = member.memberships.filter(status='active').first()
        from apps.memberships.serializers import MembershipSerializer
        membership_data = MembershipSerializer(active_membership).data if active_membership else None

        # 3. Goals
        goals = member.goals.all()
        goals_data = MemberGoalSerializer(goals, many=True).data

        # 4. Progress Summary (Latest measurement)
        latest_measurement = member.measurements.first()
        progress_data = BodyMeasurementSerializer(latest_measurement).data if latest_measurement else None

        # 5. Achievements
        achievements = member.achievements.all()
        achievements_data = MemberAchievementSerializer(achievements, many=True).data

        # 6. Assigned Trainer
        from apps.trainers.serializers import TrainerListSerializer
        trainer_data = TrainerListSerializer(member.assigned_trainer).data if member.assigned_trainer else None
        
        # Inject assigned_trainer directly into member_data for frontend compatibility
        member_data['assigned_trainer'] = trainer_data

        # 7. Upcoming Classes (mock for now since Classes aren't fully modelled)
        upcoming_classes = []

        return Response({
            "member": member_data,
            "membership": membership_data,
            "goals": goals_data,
            "upcoming_classes": upcoming_classes,
            "achievements": achievements_data,
            "progress_summary": progress_data,
            "attendance_streak": member.attendance_streak
        })


class MemberGoalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MemberGoalSerializer

    def get_queryset(self):
        try:
            return MemberGoal.objects.filter(member=self.request.user.member_profile)
        except (Member.DoesNotExist, AttributeError):
            return MemberGoal.objects.none()

    def perform_create(self, serializer):
        try:
            serializer.save(member=self.request.user.member_profile)
        except (Member.DoesNotExist, AttributeError):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("No member profile found for this user.")


class BodyMeasurementViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BodyMeasurementSerializer

    def get_queryset(self):
        try:
            return BodyMeasurement.objects.filter(member=self.request.user.member_profile)
        except (Member.DoesNotExist, AttributeError):
            return BodyMeasurement.objects.none()

    def perform_create(self, serializer):
        try:
            serializer.save(member=self.request.user.member_profile)
        except (Member.DoesNotExist, AttributeError):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("No member profile found for this user.")

