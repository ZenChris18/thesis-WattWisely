from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Challenge
import json
from datetime import datetime

# ✅ Get all challenges (Keep existing code)
def get_challenges(request):
    challenges = Challenge.objects.all()
    data = [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "requirement_kwh": c.requirement_kwh,
            "status": c.status,
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
            if not challenge.status:  # Only mark if not already completed
                challenge.status = True
                challenge.date_completed = datetime.now()
                challenge.save()

            # ✅ Return updated challenge data
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



