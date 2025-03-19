from django.db import models
from django.contrib.auth.models import User

class Challenge(models.Model):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    requirement_kwh = models.FloatField()  # Required kWh reduction
    status = models.BooleanField(default=False)  # False = Not completed, True = Completed
    date_completed = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

class UserChallenge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
