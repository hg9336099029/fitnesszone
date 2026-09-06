from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q
import datetime

from apps.trainers.models import Trainer, TrainerMonthlyPerformance
from apps.trainers.serializers import (
    TrainerListSerializer,
    TrainerDetailSerializer,
    TrainerCreateSerializer,
    TrainerMonthlyPerformanceSerializer,
    TargetOverrideSerializer,
)
from apps.trainers import services


class TrainerViewSet(viewsets.ModelViewSet):
    """
    CRUD for Trainers.

    list   GET  /api/trainers/
    create POST /api/trainers/
    retrieve GET /api/trainers/{id}/
    update   PUT/PATCH /api/trainers/{id}/
    destroy  DELETE /api/trainers/{id}/

    Extra actions:
      GET  /api/trainers/{id}/performance/          — full performance history
      GET  /api/trainers/{id}/next_month_target/    — calculated target for next month
      POST /api/trainers/{id}/override_target/      — admin override
      POST /api/trainers/{id}/update_achieved/      — update achieved count
    """

    queryset = Trainer.objects.select_related("user").prefetch_related("assigned_members").all()
    permission_classes = [AllowAny]  # TODO: replace with IsAdminUser / IsAuthenticated
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields  = ["user__full_name", "user__mobile", "specialization"]
    ordering_fields = ["user__full_name", "experience_years", "rating"]
    ordering = ["user__full_name"]

    def get_serializer_class(self):
        if self.action == "create":
            return TrainerCreateSerializer
        if self.action == "list":
            return TrainerListSerializer
        return TrainerDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = TrainerCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        trainer = serializer.save()
        return Response(
            TrainerDetailSerializer(trainer).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"], url_path="performance")
    def performance(self, request, pk=None):
        """Full monthly performance history for a trainer."""
        trainer = self.get_object()
        records = TrainerMonthlyPerformance.objects.filter(trainer=trainer).order_by("-year", "-month")
        return Response(TrainerMonthlyPerformanceSerializer(records, many=True).data)

    @action(detail=True, methods=["get"], url_path="next-month-target")
    def next_month_target(self, request, pk=None):
        """Calculate the adjusted target for next month."""
        trainer = self.get_object()
        now = timezone.now()
        if now.month == 12:
            target_month, target_year = 1, now.year + 1
        else:
            target_month, target_year = now.month + 1, now.year

        result = services.calculate_next_month_target(trainer, target_month, target_year)
        return Response({
            "month":                     result.month,
            "year":                      result.year,
            "base_target":               result.base_next_month_target,
            "adjusted_target":           result.adjusted_next_month_target,
            "previous_overachievement":  result.previous_overachievement,
            "previous_target":           result.previous_target,
            "previous_achieved":         result.previous_achieved,
        })

    @action(detail=True, methods=["post"], url_path="override-target")
    def override_target(self, request, pk=None):
        """Admin override of current month target."""
        trainer = self.get_object()
        serializer = TargetOverrideSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        now = timezone.now()
        record = services.override_target(
            trainer=trainer,
            month=now.month,
            year=now.year,
            new_target=serializer.validated_data["new_target"],
            reason=serializer.validated_data["reason"],
            overridden_by=request.user if request.user.is_authenticated else None,
        )
        return Response(TrainerMonthlyPerformanceSerializer(record).data)

    @action(detail=True, methods=["post"], url_path="update-achieved")
    def update_achieved(self, request, pk=None):
        """Update achieved count for current month."""
        trainer = self.get_object()
        achieved = request.data.get("achieved")
        if achieved is None or not str(achieved).isdigit():
            return Response({"error": "achieved must be a positive integer."}, status=400)

        now = timezone.now()
        record = services.update_achieved_count(trainer, now.month, now.year, int(achieved))
        return Response(TrainerMonthlyPerformanceSerializer(record).data)


class TrainerDashboardView(APIView):
    """
    GET /api/trainers/dashboard/?trainer_id={id}
    Returns a comprehensive dashboard payload for a trainer.
    Uses trainer_id query param (for dev) or derives from auth token.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        now = timezone.now()
        today = now.date()

        # Resolve trainer — from query param (dev) or auth token
        trainer_id = request.query_params.get("trainer_id")
        if trainer_id:
            try:
                trainer = Trainer.objects.select_related("user").prefetch_related("assigned_members").get(id=trainer_id)
            except Trainer.DoesNotExist:
                return Response({"error": "Trainer not found."}, status=404)
        elif request.user.is_authenticated and hasattr(request.user, "trainer_profile"):
            trainer = request.user.trainer_profile
        else:
            # Fallback: first active trainer
            trainer = Trainer.objects.filter(is_active=True).select_related("user").prefetch_related("assigned_members").first()
            if not trainer:
                return Response({"error": "No trainer found."}, status=404)

        # ── Current Month Performance ────────────────────────────
        # Auto-create this month's record with 10,000 as the starting target if none exists
        perf = services.create_or_get_performance_record(
            trainer, now.month, now.year, starting_target=10_000
        )

        current_month_performance = {
            "month": now.month,
            "year": now.year,
            "target": perf.target,
            "achieved": perf.achieved,
            "achievement_percentage": float(perf.achievement_percentage),
            "difference": perf.difference,
            "remaining": perf.remaining,
        }

        # ── Next Month Target ────────────────────────────────────
        if now.month == 12:
            next_month, next_year = 1, now.year + 1
        else:
            next_month, next_year = now.month + 1, now.year

        next_target_data = services.calculate_next_month_target(trainer, next_month, next_year, starting_target=10_000)
        next_month_target = {
            "month": next_target_data.month,
            "year": next_target_data.year,
            "base_target": next_target_data.base_next_month_target,
            "adjusted_target": next_target_data.adjusted_next_month_target,
            "previous_overachievement": next_target_data.previous_overachievement,
        }

        # ── Performance History (last 6 months) ─────────────────
        history_records = TrainerMonthlyPerformance.objects.filter(
            trainer=trainer
        ).order_by("-year", "-month")[:6]

        performance_history = [
            {
                "month": r.month,
                "year": r.year,
                "target": r.target,
                "achieved": r.achieved,
                "achievement_percentage": float(r.achievement_percentage),
            }
            for r in reversed(list(history_records))
        ]

        # ── Assigned Members ─────────────────────────────────────
        from apps.members.models import Member
        from apps.memberships.models import Membership

        assigned_members_qs = trainer.assigned_members.select_related("user").prefetch_related(
            "memberships__plan"
        ).all()

        assigned_members = []
        for m in assigned_members_qs:
            active_membership = m.memberships.filter(status="active").first()
            assigned_members.append({
                "id": m.id,
                "member_id": m.member_id,
                "full_name": m.user.full_name,
                "mobile": m.user.mobile,
                "membership_level": active_membership.plan.level if active_membership else None,
                "membership_status": active_membership.status if active_membership else "pending",
            })

        # ── Recent Check-ins (today) ─────────────────────────────
        from apps.attendance.models import AttendanceRecord

        member_ids = [m["id"] for m in assigned_members]
        today_checkins = AttendanceRecord.objects.filter(
            member__in=member_ids, date=today
        ).select_related("member__user").order_by("-check_in")[:10]

        checked_in_ids = set(r.member_id for r in today_checkins)

        recent_check_ins = [
            {
                "id": r.id,
                "member_id": r.member_id,
                "member_name": r.member.user.full_name,
                "check_in": r.check_in.isoformat(),
                "check_out": r.check_out.isoformat() if r.check_out else None,
            }
            for r in today_checkins
        ]

        not_checked_in = [
            {"id": m["id"], "full_name": m["full_name"]}
            for m in assigned_members if m["id"] not in checked_in_ids
        ]

        # ── Alerts ───────────────────────────────────────────────
        alerts = []
        if len(not_checked_in) > 0:
            alerts.append({
                "id": 1,
                "type": "warning",
                "message": f"Attention: {len(not_checked_in)} member(s) have not checked in today."
            })

        if perf:
            pct = float(perf.achievement_percentage)
            if pct >= 80:
                alerts.append({
                    "id": 2,
                    "type": "info",
                    "message": f"Target Progress: You have achieved {round(pct)}% of your target for this month. {100 - round(pct)}% more to hit 100%!"
                })

        # ── Trainer Info ─────────────────────────────────────────
        trainer_info = {
            "id": trainer.id,
            "full_name": trainer.user.full_name,
            "mobile": trainer.user.mobile,
            "specialization": trainer.specialization,
            "rating": str(trainer.rating) if trainer.rating else None,
            "experience_years": trainer.experience_years,
        }

        return Response({
            "trainer": trainer_info,
            "current_month_performance": current_month_performance,
            "next_month_target": next_month_target,
            "performance_history": performance_history,
            "assigned_members": assigned_members,
            "recent_check_ins": recent_check_ins,
            "not_checked_in": not_checked_in,
            "alerts": alerts,
            # Classes/Goals are not yet modelled; return empty
            "today_classes": [],
            "member_goals": [],
        })

