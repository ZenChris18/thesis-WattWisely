from django.http import JsonResponse
from .models import TotalPoints, Badge, UnlockedBadge, SelectedBadge
from django.db.models import Sum
from challenges.models import Challenge, WeeklyChallenge
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

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
    badges = list(Badge.objects.values("id", "name", "threshold", "image", "difficulty"))
    return JsonResponse({"badges": badges})

def get_unlocked_badges(request):
    unlocked = list(
        UnlockedBadge.objects.select_related('badge').values(
            'badge__id', 
            'badge__name', 
            'badge__image', 
            'date_unlocked'
        )
    )
    
    unlocked = [
        {
            'id': badge['badge__id'],
            'name': badge['badge__name'],
            'image': badge['badge__image'],
            'date_unlocked': badge['date_unlocked']
        }
        for badge in unlocked
    ]
    return JsonResponse({"unlocked_badges": unlocked})


def check_and_unlock_badges():
    total_points = TotalPoints.objects.get(id=1).points  # Get current points
    eligible_badges = Badge.objects.filter(threshold__lte=total_points)  # Find badges to unlock

    for badge in eligible_badges:
        # Check if the badge is already unlocked
        if not UnlockedBadge.objects.filter(badge=badge).exists():
            UnlockedBadge.objects.create(badge=badge)  # Unlock the badge
            print(f"🔓 Unlocked new badge: {badge.name}")  # Debugging message


@csrf_exempt
@require_http_methods(["POST"])
def set_selected_badge(request):
    try:
        data = json.loads(request.body)
        badge_id = data.get("badge_id")

        if not badge_id:
            return JsonResponse({"error": "Badge ID not provided."}, status=400)

        try:
            badge = Badge.objects.get(id=badge_id)
        except Badge.DoesNotExist:
            return JsonResponse({"error": "Badge not found."}, status=404)

        if not UnlockedBadge.objects.filter(badge=badge).exists():
            return JsonResponse({"error": "Badge is not unlocked yet."}, status=403)

        SelectedBadge.objects.all().delete()  # Clear previous selection (only one allowed)
        SelectedBadge.objects.create(badge=badge)
        return JsonResponse({"message": f"{badge.name} selected successfully."})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)


def get_selected_badge(request):
    selected = SelectedBadge.objects.first()
    if not selected:
        return JsonResponse({"selected_badge": None})
    
    return JsonResponse({
        "selected_badge": {
            "id": selected.badge.id,
            "name": selected.badge.name,
            "image": selected.badge.image,
        }
    })


