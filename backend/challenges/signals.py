from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Challenge, WeeklyChallenge

@receiver(post_migrate)
def create_default_challenges(sender, **kwargs):
    if sender.name == "challenges":  # Only run for this app
        default_challenges = [
            {"title": "The Journey Begins", "description": "For opening WattWisely.", "requirement_kwh": 0, "points": 1},
            {"title": "Wattling", "description": "Save 10 kWh lower than yesterday.", "requirement_kwh": 10, "points": 1},
            {"title": "Wattdawan", "description": "Save 50 kWh lower than yesterday.", "requirement_kwh": 50, "points": 1},
            {"title": "Watt Knight", "description": "Save 100 kWh lower than yesterday.", "requirement_kwh": 100, "points": 1},
            {"title": "Watt Master", "description": "Save 150 kWh lower than yesterday.", "requirement_kwh": 150, "points": 1},
            {"title": "Grand Master of Watts", "description": "Save 200 kWh lower than yesterday.", "requirement_kwh": 200, "points": 1},
            {"title": "Megawatt Master", "description": "Save 250 kWh lower than yesterday.", "requirement_kwh": 250, "points": 1},
        ]

        for challenge_data in default_challenges:
            Challenge.objects.get_or_create(title=challenge_data["title"], defaults=challenge_data)

        # 🆕 Default Weekly Challenges (without week_start/week_end)
        weekly_challenges = [
            {"title": "Watt Warrior", "description": "Save 500 kWh.", "requirement_kwh": 500, "points": 3},
            {"title": "Energy Champion", "description": "Save 750 kWh.", "requirement_kwh": 750, "points": 3},
            {"title": "Ultimate Saver", "description": "Save 1000 kWh.", "requirement_kwh": 1000, "points": 3},
        ]

        for weekly_data in weekly_challenges:
            WeeklyChallenge.objects.get_or_create(title=weekly_data["title"], defaults=weekly_data)
