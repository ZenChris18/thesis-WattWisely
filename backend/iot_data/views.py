from rest_framework.response import Response
from rest_framework.decorators import api_view
from .influx_service import fetch_power_data

@api_view(['GET'])
def power_data_view(request):
    data = fetch_power_data()
    return Response(data)
