# app/serializers.py
from rest_framework import serializers
from .models import IRData

class IRDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = IRData
        fields = ['source', 'sensor_value', 'timestamp']
