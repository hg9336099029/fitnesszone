from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.trainers.models import Trainer

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with test users for all roles'

    def handle(self, *args, **options):
        # Admin User
        admin_mobile = '9000000001'
        admin_email = 'admin@fitnesszone.in'
        if not User.objects.filter(mobile=admin_mobile).exists():
            User.objects.create_superuser(
                mobile=admin_mobile,
                email=admin_email,
                full_name='System Admin',
                password='password123'
            )
            self.stdout.write(self.style.SUCCESS(f'Created Admin: {admin_mobile} / {admin_email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Admin {admin_mobile} already exists'))

        # Trainer User
        trainer_mobile = '9000000002'
        trainer_email = 'trainer@fitnesszone.in'
        if not User.objects.filter(mobile=trainer_mobile).exists():
            trainer_user = User.objects.create_user(
                mobile=trainer_mobile,
                email=trainer_email,
                full_name='John Trainer',
                password='password123',
                role='staff',
                is_staff=True
            )
            Trainer.objects.create(user=trainer_user, bio="Expert Trainer")
            self.stdout.write(self.style.SUCCESS(f'Created Trainer: {trainer_mobile} / {trainer_email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Trainer {trainer_mobile} already exists'))

        # Member User
        member_mobile = '9000000003'
        member_email = 'member@fitnesszone.in'
        if not User.objects.filter(mobile=member_mobile).exists():
            User.objects.create_user(
                mobile=member_mobile,
                email=member_email,
                full_name='Alice Member',
                password='password123',
                role='member'
            )
            self.stdout.write(self.style.SUCCESS(f'Created Member: {member_mobile} / {member_email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Member {member_mobile} already exists'))

        self.stdout.write(self.style.SUCCESS('\nAll test users have password: password123'))
