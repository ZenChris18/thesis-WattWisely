from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.utils import timezone
from .models import Challenge, WeeklyChallenge

@receiver(post_migrate)
def create_default_challenges(sender, **kwargs):
    if sender.name == "challenges": 

        # 40 points for the first 10 challenges
        default_challenges = [
            {"title": "Trial 1", "description": "Get started by opening WattWisely.", "requirement_kwh": 0, "requirement_pct": 0, "points": 1, "status": True, "date_completed": timezone.now(), "claimed": False},
            {"title": "Trial 2", "description": "Make a small change—lower your usage by at least 10%.", "requirement_kwh": 0.5, "requirement_pct": 10, "points": 1},
            {"title": "Trial 3", "description": "Keep going! Lower your usage by at least 20%.", "requirement_kwh": 2, "requirement_pct": 20, "points": 2},
            {"title": "Trial 4", "description": "You’re building a habit! Lower your usage by at least 30%.", "requirement_kwh": 4, "requirement_pct": 30, "points": 3},
            {"title": "Trial 5", "description": "Nice work! Lower your usage by at least 40%.", "requirement_kwh": 6, "requirement_pct": 40, "points": 3},
            {"title": "Trial 6", "description": "You’re getting the hang of this! Lower your usage by at least 50%.", "requirement_kwh": 8, "requirement_pct": 50, "points": 4},
            {"title": "Trial 7", "description": "Your efforts are adding up! Lower your usage by at least 55%.", "requirement_kwh": 12, "requirement_pct": 55, "points": 5},
            {"title": "Trial 8", "description": "Almost there! Lower your usage by at least 60%.", "requirement_kwh": 15, "requirement_pct": 60, "points": 6},
            {"title": "Trial 9", "description": "Stay consistent! Lower your usage by at least 65%.", "requirement_kwh": 18, "requirement_pct": 65, "points": 7},
            {"title": "Trial 10", "description": "Final challenge! Lower your usage by at least 70%.", "requirement_kwh": 20, "requirement_pct": 70, "points": 8},
        ]

        for challenge_data in default_challenges:
            Challenge.objects.get_or_create(title=challenge_data["title"], defaults=challenge_data)

        # 20 points for the first 7 weekly challenges
        weekly_challenges = [
            {"title": "Weekly Trial 1", "description": "Start strong! Lower your weekly usage by at least 10%.", "requirement_kwh": 20, "requirement_pct": 10, "points": 5},
            {"title": "Weekly Trial 2", "description": "Keep it up! Lower your weekly usage by at least 20%.", "requirement_kwh": 40, "requirement_pct": 20, "points": 7},
            {"title": "Weekly Trial 3", "description": "You're making a real difference! Lower your weekly usage by at least 30%.", "requirement_kwh": 60, "requirement_pct": 30, "points": 10},
            {"title": "Weekly Trial 4", "description": "Your progress is paying off! Lower your weekly usage by at least 40%.", "requirement_kwh": 80, "requirement_pct": 40, "points": 12},
            {"title": "Weekly Trial 5", "description": "Stay on track! Lower your weekly usage by at least 50%.", "requirement_kwh": 100, "requirement_pct": 50, "points": 15},
            {"title": "Weekly Trial 6", "description": "You're getting really efficient! Lower your weekly usage by at least 60%.", "requirement_kwh": 120, "requirement_pct": 60, "points": 17},
            {"title": "Weekly Trial 7", "description": "Big challenge ahead! Lower your weekly usage by at least 70%.", "requirement_kwh": 150, "requirement_pct": 70, "points": 20},
        ]

        for weekly_data in weekly_challenges:
            WeeklyChallenge.objects.get_or_create(title=weekly_data["title"], defaults=weekly_data)
