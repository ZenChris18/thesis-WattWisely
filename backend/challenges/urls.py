from django.urls import path
from .views import (
    get_challenges, 
    complete_challenge, 
    get_weekly_challenges, 
    claim_challenge_points,
    complete_weekly_challenge, 
    claim_weekly_challenge_points  
)

urlpatterns = [
    path("", get_challenges, name="get_challenges"),
    path("complete/", complete_challenge, name="complete_challenge"),
    path("weekly/", get_weekly_challenges, name="get_weekly_challenges"),
    path("claim-points/", claim_challenge_points, name="claim_challenge_points"),
    path("weekly/complete/", complete_weekly_challenge, name="complete_weekly_challenge"),
    path("weekly/claim-points/", claim_weekly_challenge_points, name="claim_weekly_challenge_points"),
]