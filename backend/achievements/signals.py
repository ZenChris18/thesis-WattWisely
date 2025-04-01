from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Badge, UnlockedBadge

@receiver(post_migrate)
def create_default_badges(sender, **kwargs):
    if sender.name == "achievements":  # Ensure this only runs for the achievements app

        # List of default badges with thresholds and image filenames
        default_badges = [
            {"name": "The Journey Begins", "threshold": 0, "image": "The_Journey_Begins.png"},
            {"name": "Wattling", "threshold": 3, "image": "Wattling.png"},
            {"name": "Wattdawan", "threshold": 10, "image": "Wattdawan.png"},
            {"name": "Watt Knight", "threshold": 15, "image": "Watt_Knight.png"},
            {"name": "Watt Master", "threshold": 20, "image": "Watt_Master.png"},
            {"name": "Grand Master of Watts", "threshold": 25, "image": "Grand_Master_of_Watts.png"},
            {"name": "Megawatt Master", "threshold": 30, "image": "Megawatt_Master.png"},
            {"name": "I Find Your Lack of Watts Disturbing", "threshold": 35, "image": "I_Find_Your_Lack_of_Watts_Disturbing.png"},
            {"name": "The Low Power Order", "threshold": 40, "image": "The_Low_Power_Order.png"},
            {"name": "May The Watts Be With You", "threshold": 50, "image": "May_The_Watts_Be_With_You.png"},
        ]

        for badge_data in default_badges:
            Badge.objects.get_or_create(name=badge_data["name"], defaults=badge_data)

        # Unlock a badge for testing (REMOVE THIS IN PRODUCTION)
        test_badge = Badge.objects.get(name="Grand Master of Watts")
        UnlockedBadge.objects.get_or_create(badge=test_badge)
