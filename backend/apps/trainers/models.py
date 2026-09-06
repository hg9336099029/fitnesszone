from django.db import models
from apps.accounts.models import User


class Trainer(models.Model):
    """
    Trainer profile — linked 1-to-1 with a staff User.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="trainer_profile")
    specialization = models.JSONField(default=list, help_text="List of specializations")
    experience_years = models.PositiveSmallIntegerField(default=0)
    certifications = models.JSONField(default=list, help_text="List of certifications")
    bio = models.TextField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    availability = models.CharField(max_length=200, blank=True, help_text="e.g. Mon–Sat, 6AM–8PM")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "trainers"

    def __str__(self):
        return f"Trainer: {self.user.full_name}"


class TrainerMonthlyPerformance(models.Model):
    """
    Immutable monthly performance record for each trainer.

    The next-month target calculation logic lives in services.py
    and is the source of truth. Records are never overwritten —
    each month is stored as a new row.
    """

    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE, related_name="monthly_performances")
    month = models.PositiveSmallIntegerField(help_text="1=January, 12=December")
    year = models.PositiveSmallIntegerField()

    # Target (may be auto-calculated or manually overridden)
    target = models.PositiveIntegerField()
    achieved = models.PositiveIntegerField(default=0)

    # Computed fields (stored for historical consistency)
    difference = models.IntegerField(default=0)
    achievement_percentage = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    overachievement = models.PositiveIntegerField(default=0)

    # Manual override audit trail
    is_overridden = models.BooleanField(default=False)
    original_target = models.PositiveIntegerField(null=True, blank=True)
    override_reason = models.TextField(blank=True)
    overridden_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="target_overrides",
    )
    overridden_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "trainer_monthly_performance"
        unique_together = [["trainer", "month", "year"]]
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.trainer} — {self.month}/{self.year}: {self.achieved}/{self.target}"

    def save(self, *args, **kwargs):
        """Auto-compute derived fields before saving."""
        self.difference = self.achieved - self.target
        self.achievement_percentage = round((self.achieved / self.target) * 100, 2) if self.target else 0
        self.overachievement = max(self.achieved - self.target, 0)
        super().save(*args, **kwargs)

    @property
    def remaining(self):
        return max(self.target - self.achieved, 0)
