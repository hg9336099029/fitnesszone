from django.db import models
from django.core.validators import MinValueValidator
from apps.accounts.models import User


class MembershipPlan(models.Model):
    """Configurable membership plans — not hard-coded."""

    class Level(models.TextChoices):
        STARTER = "starter", "Starter"
        BUILDER = "builder", "Builder"
        PRO = "pro", "Pro"
        ELITE = "elite", "Elite"

    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=Level.choices)
    price_inr = models.PositiveIntegerField(help_text="Price in Indian Rupees")
    duration_days = models.PositiveIntegerField(default=30)
    features = models.JSONField(default=list, help_text="List of feature strings")
    personal_training = models.BooleanField(default=False)
    class_access = models.BooleanField(default=False)
    guest_passes = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "membership_plans"
        ordering = ["price_inr"]

    def __str__(self):
        return f"{self.name} — ₹{self.price_inr}/month"


class Membership(models.Model):
    """Active membership linking a member to a plan."""

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        EXPIRED = "expired", "Expired"
        PENDING = "pending", "Pending"
        CANCELLED = "cancelled", "Cancelled"

    member = models.ForeignKey(
        "members.Member",
        on_delete=models.CASCADE,
        related_name="memberships",
    )
    plan = models.ForeignKey(MembershipPlan, on_delete=models.PROTECT, related_name="memberships")
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    auto_renew = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "memberships"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.member} — {self.plan.name} ({self.status})"

    @property
    def is_active(self):
        from django.utils import timezone
        return self.status == self.Status.ACTIVE and self.end_date >= timezone.now().date()
