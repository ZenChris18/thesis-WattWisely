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

    # Check if any new badges should be unlocked
    check_and_unlock_badges()

    return JsonResponse({"total_points": total_points_obj.points})


def get_badges(request):
    badges = list(Badge.objects.values("id", "name", "threshold", "image"))
    return JsonResponse({"badges": badges})

def get_unlocked_badges(request):
    unlocked = list(
        UnlockedBadge.objects.values("id", "badge__name", "badge__image", "date_unlocked")
    )
    return JsonResponse({"unlocked_badges": unlocked})

def check_and_unlock_badges():
    total_points = TotalPoints.objects.get(id=1).points  # Get current points
    eligible_badges = Badge.objects.filter(threshold__lte=total_points)  # Find badges to unlock

    for badge in eligible_badges:
        # Check if the badge is already unlocked
        if not UnlockedBadge.objects.filter(badge=badge).exists():
            UnlockedBadge.objects.create(badge=badge)  # Unlock the badge
            print(f"🔓 Unlocked new badge: {badge.name}")  # Debugging message

