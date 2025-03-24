from django.db import models

class Appliance(models.Model):
    entity_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
