from django.urls import path
from .views import power_data_view

urlpatterns = [
    path('power-data/', power_data_view, name='power-data'),
]
