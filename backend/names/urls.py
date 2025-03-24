from django.urls import path
from .views import update_appliance_name, get_appliance_names

urlpatterns = [
    path('update-name/', update_appliance_name, name='update_appliance_name'),
    path('get-names/', get_appliance_names, name='get_appliance_names'),
]
