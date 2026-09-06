from django.db import models
from apps.accounts.models import User


class MembershipLevel(models.TextChoices):
    STARTER = "starter", "Starter"
    BUILDER = "builder", "Builder"
    PRO = "pro", "Pro"
    ELITE = "elite", "Elite"


class MembershipStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    EXPIRED = "expired", "Expired"
    PENDING = "pending", "Pending"
    CANCELLED = "cancelled", "Cancelled"


class Member(models.Model):
    """
    Gym-specific profile for a member.
    Extends the base User model with gym-related data.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="member_profile")
    member_id = models.CharField(max_length=20, unique=True, db_index=True)  # e.g. FZ-00101
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[("male", "Male"), ("female", "Female"), ("other", "Other")], blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10, blank=True)
    emergency_contact_name = models.CharField(max_length=150, blank=True)
    emergency_contact_mobile = models.CharField(max_length=15, blank=True)
    assigned_trainer = models.ForeignKey(
        "trainers.Trainer",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_members",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "members"
        verbose_name = "Member"
        verbose_name_plural = "Members"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.member_id} — {self.user.full_name}"

    def save(self, *args, **kwargs):
        # Auto-generate member_id if not set
        if not self.member_id:
            last = Member.objects.order_by("id").last()
            next_num = (last.id + 1) if last else 1
            self.member_id = f"FZ-{next_num:05d}"
        super().save(*args, **kwargs)

    @property
    def attendance_streak(self):
        """Calculate consecutive attendance days."""
        from apps.attendance.models import AttendanceRecord
        from django.utils import timezone
        import datetime

        records = (
            AttendanceRecord.objects.filter(member=self)
            .order_by("-date")
            .values_list("date", flat=True)
        )
        streak = 0
        expected_date = timezone.now().date()
        for record_date in records:
            if record_date == expected_date or record_date == expected_date - datetime.timedelta(days=1):
                if record_date != expected_date:
                    expected_date = record_date
                streak += 1
                expected_date -= datetime.timedelta(days=1)
            else:
                break
        return streak


class MemberGoal(models.Model):
    GOAL_TYPES = [
        ("weight_loss", "Weight Loss"),
        ("muscle_gain", "Muscle Gain"),
        ("endurance", "Endurance"),
        ("flexibility", "Flexibility"),
        ("general_fitness", "General Fitness"),
        ("custom", "Custom"),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="goals")
    type = models.CharField(max_length=20, choices=GOAL_TYPES, default="general_fitness")
    title = models.CharField(max_length=150)
    current_value = models.FloatField(default=0.0)
    target_value = models.FloatField()
    unit = models.CharField(max_length=20, help_text="e.g. kg, lbs, km, %")
    deadline = models.DateField(null=True, blank=True)
    is_achieved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "member_goals"
        ordering = ["is_achieved", "deadline"]

    @property
    def progress_percentage(self):
        if self.target_value == 0:
            return 100 if self.current_value >= 0 else 0
        return min((self.current_value / self.target_value) * 100, 100.0)

    def __str__(self):
        return f"{self.member} - {self.title}"


class BodyMeasurement(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="measurements")
    date = models.DateField()
    weight_kg = models.FloatField(null=True, blank=True)
    body_fat_percentage = models.FloatField(null=True, blank=True)
    chest_cm = models.FloatField(null=True, blank=True)
    waist_cm = models.FloatField(null=True, blank=True)
    arms_cm = models.FloatField(null=True, blank=True)
    legs_cm = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "body_measurements"
        ordering = ["-date"]

    def __str__(self):
        return f"{self.member} - {self.date}"


class MemberAchievement(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="achievements")
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=20, help_text="Emoji or icon name")
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "member_achievements"
        ordering = ["-earned_at"]

    def __str__(self):
        return f"{self.member} - {self.title}"
