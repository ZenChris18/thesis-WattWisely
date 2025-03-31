from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Challenge, WeeklyChallenge
import json
from datetime import datetime, date
from .models import WeeklyChallenge


def get_challenges(request):
    challenges = Challenge.objects.all()
    data = [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "requirement_kwh": c.requirement_kwh,
            "status": c.status,
            "claimed": c.claimed, 
            "points": c.points,
            "date_completed": c.date_completed.strftime("%Y-%m-%d %H:%M:%S") if c.date_completed else None
        }
        for c in challenges
    ]
    return JsonResponse({"challenges": data})



@csrf_exempt
def complete_challenge(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            challenge_id = data.get("id")

            challenge = Challenge.objects.get(id=challenge_id)
            if not challenge.status:
                challenge.status = True
                challenge.date_completed = datetime.now()
                challenge.save()

            # Return updated challenge data
            return JsonResponse({
                "success": True,
                "message": "Challenge updated successfully",
                "challenge": {
                    "id": challenge.id,
                    "status": challenge.status,
                    "date_completed": challenge.date_completed.strftime("%Y-%m-%d %H:%M:%S")
                }
            })
        except Challenge.DoesNotExist:
            return JsonResponse({"error": "Challenge not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


def get_weekly_challenges(request):
    try:
        challenges = WeeklyChallenge.objects.all().values(
            "id", "title", "description", "requirement_kwh", "points", "status", "claimed", "date_completed"
        )

        return JsonResponse({"weekly_challenges": list(challenges)}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

from achievements.models import TotalPoints, Badge, UnlockedBadge

@csrf_exempt
def claim_challenge_points(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            challenge_id = data.get("challenge_id")

            challenge = Challenge.objects.get(id=challenge_id)

            if challenge.claimed:
                return JsonResponse({"success": False, "error": "Points already claimed"}, status=400)

            # Update claimed status
            challenge.claimed = True
            challenge.save()

            # Update total points
            total_points, _ = TotalPoints.objects.get_or_create(id=1)  # Assuming single row for now
            total_points.points += challenge.points
            total_points.save()

            # Check if a new badge should be unlocked
            unlocked_badges = []
            for badge in Badge.objects.filter(threshold__lte=total_points.points):
                if not UnlockedBadge.objects.filter(badge=badge).exists():
                    UnlockedBadge.objects.create(badge=badge)
                    unlocked_badges.append(badge.name)

            return JsonResponse({"success": True, "new_badges": unlocked_badges})

        except Challenge.DoesNotExist:
            return JsonResponse({"success": False, "error": "Challenge not found"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Invalid request"}, status=400)


@csrf_exempt
def complete_weekly_challenge(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            challenge_id = data.get("id")

            challenge = WeeklyChallenge.objects.get(id=challenge_id)
            if not challenge.status:
                challenge.status = True
                challenge.date_completed = datetime.now()
                challenge.save()

            return JsonResponse({
                "success": True,
                "message": "Weekly challenge updated successfully",
                "challenge": {
                    "id": challenge.id,
                    "status": challenge.status,
                    "date_completed": challenge.date_completed.strftime("%Y-%m-%d %H:%M:%S")
                }
            })
        except WeeklyChallenge.DoesNotExist:
            return JsonResponse({"error": "Weekly challenge not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def claim_weekly_challenge_points(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            challenge_id = data.get("challenge_id")

            challenge = WeeklyChallenge.objects.get(id=challenge_id)

            if challenge.claimed:
                return JsonResponse({"success": False, "error": "Points already claimed"}, status=400)

            # Update claimed status
            challenge.claimed = True
            challenge.save()

            # Update total points
            total_points, _ = TotalPoints.objects.get_or_create(id=1)  # Assuming a single row for now
            total_points.points += challenge.points
            total_points.save()

            # Check if a new badge should be unlocked
            unlocked_badges = []
            for badge in Badge.objects.filter(threshold__lte=total_points.points):
                if not UnlockedBadge.objects.filter(badge=badge).exists():
                    UnlockedBadge.objects.create(badge=badge)
                    unlocked_badges.append(badge.name)

            return JsonResponse({"success": True, "new_badges": unlocked_badges})

        except WeeklyChallenge.DoesNotExist:
            return JsonResponse({"success": False, "error": "Weekly challenge not found"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Invalid request"}, status=400)
