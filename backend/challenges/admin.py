from django.contrib import admin
from .models import Challenge, UserChallenge

class ChallengeAdmin(admin.ModelAdmin):
    list_display = ("title", "requirement_kwh", "status", "date_completed")  # Columns shown in admin
    list_filter = ("status",)  # Add filters for completed/incomplete challenges
    search_fields = ("title",)  # Allow searching by title
    ordering = ("status", "requirement_kwh")  # Order by completion status and kWh requirement

class UserChallengeAdmin(admin.ModelAdmin):
    list_display = ("user", "challenge", "completed_at")
    list_filter = ("completed_at",)

admin.site.register(Challenge, ChallengeAdmin)
admin.site.register(UserChallenge, UserChallengeAdmin)
