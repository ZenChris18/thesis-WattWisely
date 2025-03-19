from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Challenge

@receiver(post_migrate)
def create_default_challenges(sender, **kwargs):
    if sender.name == "challenges":  # Only run for this app
        default_challenges = [
            {"title": "The Journey Begins", "description": "For opening WattWisely.", "requirement_kwh": 0},
            {"title": "Wattling", "description": "Save 10 kWh lower than yesterday.", "requirement_kwh": 10},
            {"title": "Wattdawan", "description": "Save 50 kWh lower than yesterday.", "requirement_kwh": 50},
            {"title": "Watt Knight", "description": "Save 100 kWh lower than yesterday.", "requirement_kwh": 100},
            {"title": "Watt Master", "description": "Save 150 kWh lower than yesterday.", "requirement_kwh": 150},
            {"title": "Grand Master of Watts", "description": "Save 200 kWh lower than yesterday.", "requirement_kwh": 200},
            {"title": "Megawatt Master", "description": "Save 250 kWh lower than yesterday.", "requirement_kwh": 250},
        ]

        for challenge_data in default_challenges:
            Challenge.objects.get_or_create(title=challenge_data["title"], defaults=challenge_data)
