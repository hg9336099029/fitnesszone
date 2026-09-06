from django.db import models


class AttendanceRecord(models.Model):
    """
    Member check-in/check-out record.
    Designed for QR-based check-in (qr_token field).
    """

    member = models.ForeignKey(
        "members.Member",
        on_delete=models.CASCADE,
        related_name="attendance_records",
    )
    date = models.DateField(db_index=True)
    check_in = models.DateTimeField()
    check_out = models.DateTimeField(null=True, blank=True)
    # Reserved for QR-code check-in integration
    qr_token = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "attendance_records"
        ordering = ["-check_in"]
        unique_together = [["member", "date"]]
        indexes = [
            models.Index(fields=["date"]),
            models.Index(fields=["member", "date"]),
        ]

    def __str__(self):
        return f"{self.member} — {self.date}"

    @property
    def duration_minutes(self):
        if self.check_out:
            delta = self.check_out - self.check_in
            return int(delta.total_seconds() / 60)
        return None
