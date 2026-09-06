from django.db import models


class Payment(models.Model):
    """
    Payment record — designed for Indian payment methods.
    Payment gateway integration (Razorpay/UPI) is replaceable.
    """

    class Method(models.TextChoices):
        UPI = "upi", "UPI"
        CARD = "card", "Credit/Debit Card"
        NET_BANKING = "net_banking", "Net Banking"
        CASH = "cash", "Cash"
        CHEQUE = "cheque", "Cheque"

    class Status(models.TextChoices):
        PAID = "paid", "Paid"
        PENDING = "pending", "Pending"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    member = models.ForeignKey(
        "members.Member",
        on_delete=models.PROTECT,
        related_name="payments",
    )
    membership = models.ForeignKey(
        "memberships.Membership",
        on_delete=models.PROTECT,
        related_name="payments",
        null=True,
        blank=True,
    )
    amount_inr = models.PositiveIntegerField(help_text="Amount in Indian Rupees (paise-less)")
    method = models.CharField(max_length=20, choices=Method.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    # Payment gateway fields — kept generic so any provider can populate them
    transaction_id = models.CharField(max_length=255, blank=True, unique=True, null=True)
    gateway_order_id = models.CharField(max_length=255, blank=True)
    gateway_payment_id = models.CharField(max_length=255, blank=True)
    upi_ref = models.CharField(max_length=100, blank=True, help_text="UPI Reference number")

    payment_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = "payments"
        ordering = ["-payment_date"]
        indexes = [
            models.Index(fields=["member", "status"]),
            models.Index(fields=["payment_date"]),
        ]

    def __str__(self):
        return f"₹{self.amount_inr} — {self.member} ({self.status})"
