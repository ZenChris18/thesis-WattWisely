from django.contrib import admin
from .models import Badge, UnlockedBadge, TotalPoints, SelectedBadge

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ("name", "threshold", "difficulty", "image")
    search_fields = ("name", "difficulty") 

@admin.register(UnlockedBadge)
class UnlockedBadgeAdmin(admin.ModelAdmin):
    list_display = ("badge", "date_unlocked")
    search_fields = ("badge__name",)

@admin.register(TotalPoints)
class TotalPointsAdmin(admin.ModelAdmin):
    list_display = ("points",)

admin.site.register(SelectedBadge)