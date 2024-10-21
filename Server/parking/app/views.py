# app/views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import IRData
from .serializers import IRDataSerializer

@api_view(['GET', 'POST'])
def ir_data(request):
    if request.method == 'POST':
        serializer = IRDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        nodemcu_data = IRData.objects.filter(source='nodemcu').last()
        raspberry_pi_data = IRData.objects.filter(source='raspberry_pi').last()

        response_data = {
            'nodemcu': IRDataSerializer(nodemcu_data).data if nodemcu_data else None,
            'raspberry_pi': IRDataSerializer(raspberry_pi_data).data if raspberry_pi_data else None,
        }

        # Print values in a structured format
        print("NodeMCU Data:")
        if response_data['nodemcu']:
            print(f"  Sensor Value: {response_data['nodemcu']['sensor_value']}, "
                  f"Timestamp: {response_data['nodemcu']['timestamp']}")
        else:
            print("  No data available.")

        print("Raspberry Pi Data:")
        if response_data['raspberry_pi']:
            print(f"  Sensor Value: {response_data['raspberry_pi']['sensor_value']}, "
                  f"Timestamp: {response_data['raspberry_pi']['timestamp']}")
        else:
            print("  No data available.")

        return Response(response_data)
