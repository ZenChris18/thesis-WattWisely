from django.http import JsonResponse
from .models import TotalPoints, Badge, UnlockedBadge
from django.db.models import Sum
from challenges.models import Challenge, WeeklyChallenge

def get_total_points(request):
    # Sum up points from only completed & claimed challenges
    daily_points = Challenge.objects.filter(status=True, claimed=True).aggregate(total=Sum("points"))["total"] or 0
    weekly_points = WeeklyChallenge.objects.filter(status=True, claimed=True).aggregate(total=Sum("points"))["total"] or 0

    # Update total points in the database
    total_points_obj, _ = TotalPoints.objects.get_or_create(id=1)
    total_points_obj.points = daily_points + weekly_points
    total_points_obj.save()

    return JsonResponse({"total_points": total_points_obj.points})

def get_badges(request):
    badges = list(Badge.objects.values("id", "name", "threshold"))
    return JsonResponse({"badges": badges})

def get_unlocked_badges(request):
    unlocked = list(UnlockedBadge.objects.values("id", "badge__name", "date_unlocked"))
    return JsonResponse({"unlocked_badges": unlocked})
