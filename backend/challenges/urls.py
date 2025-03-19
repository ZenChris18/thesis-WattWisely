from django.urls import path
from .views import get_challenges, complete_challenge

urlpatterns = [
    path("", get_challenges, name="get_challenges"),  # Now it's just "/challenges/"
    path("complete/", complete_challenge, name="complete_challenge"),
]
