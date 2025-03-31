from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Badge, UnlockedBadge

@receiver(post_migrate)
def create_default_badges(sender, **kwargs):
    if sender.name == "achievements":  # Ensure this only runs for the achievements app

        # List of default badges with thresholds and image filenames
        default_badges = [
            {"name": "Wattling", "threshold": 3, "image": "Wattling.png"},
            {"name": "Grand Master of Watts", "threshold": 25, "image": "Grand_Master_of_Watts.png"},

        ]

        for badge_data in default_badges:
            Badge.objects.get_or_create(name=badge_data["name"], defaults=badge_data)

        # Unlock a badge for testing (REMOVE THIS IN PRODUCTION)
        test_badge = Badge.objects.get(name="Grand Master of Watts")
        UnlockedBadge.objects.get_or_create(badge=test_badge)
