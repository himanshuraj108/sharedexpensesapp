"""
Full database reset and clean re-import script.
Keeps only the 6 flat users + Rahul321 (test user can stay).
Deletes all expenses, payments, imports, and the bad group.
Resets the Flatmates Group memberships correctly.
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import transaction
from django.contrib.auth import get_user_model
from core.models import Group, GroupMembership, Expense, ExpenseSplit, Payment, CSVImport, CSVAnomaly

User = get_user_model()

with transaction.atomic():
    print("Deleting all CSVAnomaly records...")
    CSVAnomaly.objects.all().delete()

    print("Deleting all CSVImport records...")
    CSVImport.objects.all().delete()

    print("Deleting all ExpenseSplit records...")
    ExpenseSplit.objects.all().delete()

    print("Deleting all Expense records...")
    Expense.objects.all().delete()

    print("Deleting all Payment records...")
    Payment.objects.all().delete()

    print("Deleting all GroupMembership records...")
    GroupMembership.objects.all().delete()

    print("Deleting all Group records...")
    Group.objects.all().delete()

    # Ensure all flatmate users exist
    flatmates = {
        'Aisha': 'aisha@example.com',
        'Rohan': 'rohan@example.com',
        'Priya': 'priya@example.com',
        'Meera': 'meera@example.com',
        'Sam': 'sam@example.com',
        'Dev': 'dev@example.com',
    }

    # Delete all other non-staff users to keep the database clean
    other_users = User.objects.exclude(username__in=list(flatmates.keys())).exclude(is_staff=True)
    for u in other_users:
        print(f"Deleted user: {u.username}")
        u.delete()
    for username, email in flatmates.items():
        u, created = User.objects.get_or_create(username=username, defaults={'email': email})
        if created:
            u.set_password('flatmate123')
            u.save()
            print(f"Created user: {username}")
        else:
            # Ensure password is set
            u.set_password('flatmate123')
            u.save()
            print(f"Reset password for: {username}")

    # Create the ONE canonical group
    from datetime import date
    group = Group.objects.create(name="Flat 404 — Shared Expenses")
    print(f"\nCreated group: {group.name} ({group.id})")

    # Set correct memberships based on assignment context:
    # - Aisha, Rohan, Priya, Meera: from Feb 1
    # - Meera: left end of March (March 31)
    # - Dev: visiting member (Feb, also Goa trip in March) - treat as external, no permanent membership
    #   But Dev appears in expenses, so we need him. Let's add Dev as "visiting" from Feb onwards, no left_at
    # - Sam: joined mid-April (April 15)
    membership_data = [
        ('Aisha', date(2026, 2, 1), None),
        ('Rohan', date(2026, 2, 1), None),
        ('Priya', date(2026, 2, 1), None),
        ('Meera', date(2026, 2, 1), date(2026, 3, 31)),
        ('Dev', date(2026, 2, 1), None),   # visiting friend, added as member for expense tracking
        ('Sam', date(2026, 4, 15), None),
    ]

    for username, joined, left in membership_data:
        user = User.objects.get(username=username)
        gm = GroupMembership.objects.create(
            group=group,
            user=user,
            joined_at=joined,
            left_at=left
        )
        print(f"  Membership: {username} joined={joined} left={left}")

print("\n=== RESET COMPLETE ===")
print(f"Group ID: {group.id}")
print("Please note this group ID for the CSV import.")
print(f"\nAll flat users have password: flatmate123")
print("Login with: Aisha/flatmate123, Rohan/flatmate123, etc.")
