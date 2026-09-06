from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserRole(models.TextChoices):
    ADMIN = "admin", "Admin"
    STAFF = "staff", "Staff"
    MEMBER = "member", "Member"


class UserManager(BaseUserManager):
    """Custom manager using mobile number as the primary identifier."""

    def create_user(self, mobile, full_name, password=None, **extra_fields):
        if not mobile:
            raise ValueError("Mobile number is required.")
        user = self.model(mobile=mobile, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile, full_name, password=None, **extra_fields):
        extra_fields.setdefault("role", UserRole.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(mobile, full_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for FitnessZone.

    Mobile number is the primary unique identifier.
    Email is optional (for staff/admin) but recommended.
    """

    full_name = models.CharField(max_length=150)
    mobile = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(blank=True, unique=False, db_index=True)
    role = models.CharField(max_length=10, choices=UserRole.choices, default=UserRole.MEMBER)
    profile_image = models.ImageField(upload_to="profiles/", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Django admin access
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "mobile"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.full_name} ({self.mobile})"

    @property
    def is_admin(self):
        return self.role == UserRole.ADMIN

    @property
    def is_gym_staff(self):
        return self.role in (UserRole.ADMIN, UserRole.STAFF)

    @property
    def is_member_role(self):
        return self.role == UserRole.MEMBER
