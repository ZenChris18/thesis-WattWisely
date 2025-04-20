from django.db import models

class Challenge(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirement_kwh = models.FloatField()
    requirement_pct = models.FloatField(
    null=True, blank=True,
    help_text="Percent reduction target (e.g. 15 for 15%)"
    )
    status = models.BooleanField(default=False)  # Completed or not
    date_completed = models.DateTimeField(null=True, blank=True)
    points = models.IntegerField(default=1)  # Reward points
    claimed = models.BooleanField(default=False)  # New field

    def __str__(self):
        return self.title


class WeeklyChallenge(models.Model):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    requirement_kwh = models.FloatField()  # Required kWh reduction
    requirement_pct = models.FloatField(
    null=True, blank=True,
    help_text="Percent reduction target (e.g. 25 for 25%)"
    )
    status = models.BooleanField(default=False)  # Completed or not
    date_completed = models.DateTimeField(null=True, blank=True)
    points = models.IntegerField(default=3)  # Reward points
    claimed = models.BooleanField(default=False)  # Match structure with Challenge

    def __str__(self):
        return self.title

