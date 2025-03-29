from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Challenge, WeeklyChallenge

@receiver(post_migrate)
def create_default_challenges(sender, **kwargs):
    if sender.name == "challenges": 

        # 40 points for the first 10 challenges
        default_challenges = [
            {"title": "Trial 1", "description": "Get started by opening WattWisely.", "requirement_kwh": 0, "points": 1},
            {"title": "Trial 2", "description": "Make a small change—use at least 0.5 kWh less than yesterday.", "requirement_kwh": 0.5, "points": 1},
            {"title": "Trial 3", "description": "Keep going! Reduce your usage by at least 2 kWh compared to yesterday.", "requirement_kwh": 2, "points": 2},
            {"title": "Trial 4", "description": "You’re building a habit! Save at least 4 kWh more than yesterday.", "requirement_kwh": 4, "points": 3},
            {"title": "Trial 5", "description": "Nice work! Aim to lower your usage by at least 6 kWh today.", "requirement_kwh": 6, "points": 3},
            {"title": "Trial 6", "description": "You’re getting the hang of this! Cut down by at least 8 kWh today.", "requirement_kwh": 8, "points": 4},
            {"title": "Trial 7", "description": "Your efforts are adding up! Save at least 12 kWh more than yesterday.", "requirement_kwh": 12, "points": 5},
            {"title": "Trial 8", "description": "Almost there! Reduce your energy use by at least 15 kWh today.", "requirement_kwh": 15, "points": 6},
            {"title": "Trial 9", "description": "Stay consistent! Lower your usage by at least 18 kWh today.", "requirement_kwh": 18, "points": 7},
            {"title": "Trial 10", "description": "Final challenge! Cut down at least 20 kWh compared to yesterday.", "requirement_kwh": 20, "points": 8},
        ]

        for challenge_data in default_challenges:
            Challenge.objects.get_or_create(title=challenge_data["title"], defaults=challenge_data)

        # 20 points for the first 7 weekly challenges
        weekly_challenges = [
            {"title": "Weekly Trial 1", "description": "Start strong! Save at least 20 kWh more than last week.", "requirement_kwh": 20, "points": 5},
            {"title": "Weekly Trial 2", "description": "Keep it up! Reduce your usage by at least 40 kWh this week.", "requirement_kwh": 40, "points": 7},
            {"title": "Weekly Trial 3", "description": "You're making a real difference! Cut down by at least 60 kWh this week.", "requirement_kwh": 60, "points": 10},
            {"title": "Weekly Trial 4", "description": "Your progress is paying off! Lower your usage by at least 80 kWh this week.", "requirement_kwh": 80, "points": 12},
            {"title": "Weekly Trial 5", "description": "Stay on track! Save at least 100 kWh more than last week.", "requirement_kwh": 100, "points": 15},
            {"title": "Weekly Trial 6", "description": "You're getting really efficient! Cut down at least 120 kWh this week.", "requirement_kwh": 120, "points": 17},
            {"title": "Weekly Trial 7", "description": "Big challenge ahead! Save at least 150 kWh this week.", "requirement_kwh": 150, "points": 20},
        ]

        for weekly_data in weekly_challenges:
            WeeklyChallenge.objects.get_or_create(title=weekly_data["title"], defaults=weekly_data)
