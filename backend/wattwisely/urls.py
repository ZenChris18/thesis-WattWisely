from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('iot_data.urls')),
    path('', lambda request: redirect('api/power-data/', permanent=False)),  # Redirect root to /api/power-data/
    path('names/', include('names.urls')),  # Changing Names of appliance
    path('challenges/', include('challenges.urls')),  # Challenges
    path('achievements/', include('achievements.urls')),  # Added Achievements
]
