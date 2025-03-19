from django.contrib import admin
from .models import Challenge, WeeklyChallenge

class ChallengeAdmin(admin.ModelAdmin):
    list_display = ("title", "requirement_kwh", "status", "date_completed", "points")
    list_filter = ("status",)
    search_fields = ("title",)
    ordering = ("status", "requirement_kwh")

class WeeklyChallengeAdmin(admin.ModelAdmin):
    list_display = ("title", "requirement_kwh", "description", "date_completed", "points", "status")
    list_filter = ("status",)  # Only filter by status now
    search_fields = ("title",)
    ordering = ("status", "title")  # Remove week_start from ordering


admin.site.register(Challenge, ChallengeAdmin)
admin.site.register(WeeklyChallenge, WeeklyChallengeAdmin)
