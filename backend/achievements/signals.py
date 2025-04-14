from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Badge, UnlockedBadge

@receiver(post_migrate)
def create_default_badges(sender, **kwargs):
    if sender.name == "achievements":
        default_badges = [
            # padawatt (Beginner)
            {"name": "The Journey Begins", "threshold": 1, "image": "The_Journey_Begins.png", "difficulty": "padawatt"},
            {"name": "Wattling", "threshold": 3, "image": "Wattling.png", "difficulty": "padawatt"},
            {"name": "Wattdawan", "threshold": 10, "image": "Wattdawan.png", "difficulty": "padawatt"},

            # wattknight (Intermediate)
            {"name": "Watt Knight", "threshold": 15, "image": "Watt_Knight.png", "difficulty": "wattknight"},
            {"name": "Watt Master", "threshold": 20, "image": "Watt_Master.png", "difficulty": "wattknight"},
            {"name": "Grand Master of Watts", "threshold": 25, "image": "Grand_Master_of_Watts.png", "difficulty": "wattknight"},

            # wattmaster (Advanced)
            {"name": "Megawatt Master", "threshold": 30, "image": "Megawatt_Master.png", "difficulty": "wattmaster"},
            {"name": "I Find Your Lack of Watts Disturbing", "threshold": 35, "image": "I_Find_Your_Lack_of_Watts_Disturbing.png", "difficulty": "wattmaster"},
            {"name": "The Low Power Order", "threshold": 40, "image": "The_Low_Power_Order.png", "difficulty": "wattmaster"},

            # wattlord (Legendary / Sith Lord)
            {"name": "May The Watts Be With You", "threshold": 50, "image": "May_The_Watts_Be_With_You.png", "difficulty": "wattlord"},
        ]

        for badge_data in default_badges:
            Badge.objects.get_or_create(name=badge_data["name"], defaults=badge_data)
