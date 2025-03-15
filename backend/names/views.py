from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Appliance
import json

@csrf_exempt
def update_appliance_name(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            entity_id = data.get("entity_id")
            new_name = data.get("name")

            if not entity_id or not new_name:
                return JsonResponse({"error": "Invalid data"}, status=400)

            appliance, created = Appliance.objects.update_or_create(
                entity_id=entity_id,
                defaults={"name": new_name}
            )

            return JsonResponse({"message": "Appliance name updated", "created": created})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request"}, status=400)

def get_appliance_names(request):
    appliances = Appliance.objects.all()
    names = {appliance.entity_id: appliance.name for appliance in appliances}
    return JsonResponse({"names": names})