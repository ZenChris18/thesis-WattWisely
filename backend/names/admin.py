from django.contrib import admin
from .models import Appliance  # Import the model

class ApplianceAdmin(admin.ModelAdmin):
    list_display = ("entity_id", "name")  # Display entity_id and name in the admin panel
    search_fields = ("entity_id", "name")  # Allow searching by entity_id and name
    list_filter = ("name",)  # Optional: Add filtering by name

admin.site.register(Appliance, ApplianceAdmin)  # Register the model
