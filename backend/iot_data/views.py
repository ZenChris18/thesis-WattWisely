from django.http import JsonResponse
from .influx_service import fetch_power_data

def power_data_view(request):
    data = fetch_power_data()
    return JsonResponse(data, safe=False, json_dumps_params={'indent': 4}) # So the json format looks clean
