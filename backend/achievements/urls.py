from django.urls import path
from .views import get_total_points, get_badges, get_unlocked_badges

urlpatterns = [
    path("total-points/", get_total_points, name="total_points"),
    path("badges/", get_badges, name="badges"),
    path("unlocked-badges/", get_unlocked_badges, name="unlocked_badges"),
]
