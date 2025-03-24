from django.urls import path
from .views import get_challenges, complete_challenge, get_weekly_challenges, claim_challenge_points

urlpatterns = [
    path("", get_challenges, name="get_challenges"),
    path("complete/", complete_challenge, name="complete_challenge"),
    path("weekly/", get_weekly_challenges, name="get_weekly_challenges"),  # 🆕 New Weekly Challenges endpoint
    path("claim-points/", claim_challenge_points, name="claim_challenge_points"),
]
