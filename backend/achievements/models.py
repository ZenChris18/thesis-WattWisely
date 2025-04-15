from django.db import models

class TotalPoints(models.Model):
    points = models.IntegerField(default=0)  # Total claimed points

    def __str__(self):
        return f"Total Points: {self.points}"

class Badge(models.Model):
    DIFFICULTY_CHOICES = [
        ('padawatt', 'Padawatt'),       # Easy
        ('wattknight', 'Watt Knight'),  # Medium
        ('wattmaster', 'Watt Master'),  # Hard
        ('wattlord', 'Watt Lord'),      # Legendary
    ]

    name = models.CharField(max_length=255, unique=True)
    threshold = models.IntegerField()  # Points needed to unlock
    image = models.CharField(max_length=255, blank=True, null=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='padawatt')

    def __str__(self):
        return self.name



class UnlockedBadge(models.Model):
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    date_unlocked = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Unlocked: {self.badge.name}"

# this is for the showcase badge
class SelectedBadge(models.Model):
    badge = models.OneToOneField(Badge, on_delete=models.CASCADE)

    def __str__(self):
        return f"Selected: {self.badge.name}"
