from django.db import models

class TotalPoints(models.Model):
    points = models.IntegerField(default=0)  # Total claimed points

    def __str__(self):
        return f"Total Points: {self.points}"

class Badge(models.Model):
    name = models.CharField(max_length=255, unique=True)
    threshold = models.IntegerField()  # Points needed to unlock
    image = models.CharField(max_length=255, blank=True, null=True)  # Allow empty image

    def __str__(self):
        return self.name


class UnlockedBadge(models.Model):
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    date_unlocked = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Unlocked: {self.badge.name}"
