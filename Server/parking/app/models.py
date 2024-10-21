# app/models.py
from django.db import models

class IRData(models.Model):
    source = models.CharField(max_length=50)  # To identify whether data is from NodeMCU or Raspberry Pi
    sensor_value = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source}: {self.sensor_value} at {self.timestamp}"
