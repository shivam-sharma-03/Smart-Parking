import RPi.GPIO as GPIO
import requests
import time

# Set the GPIO mode
GPIO.setmode(GPIO.BCM)

# Set the GPIO pin for the IR sensor
IR_PIN = 14  # Change this if using a different GPIO pin
GPIO.setup(IR_PIN, GPIO.IN)

# URL of your Django backend API
url = 'http://192.168.30.143:8000/ir-data/'  # Update with your actual URL

try:
    while True:
        # Read the IR sensor value (1 for detected, 0 for not detected)
        ir_value = GPIO.input(IR_PIN) * 1023 + 1
        
        # Print the value (for debugging)
        print(f"IR Sensor Value: {ir_value}")

        # Prepare the data to send
        data = {
            'source': 'raspberry_pi',
            'sensor_value': ir_value,
        }

        # Send the data to the Django backend
        response = requests.post(url, json=data)

        if response.status_code == 201:
            print("Data sent successfully")
        else:
            print("Failed to send data", response.status_code)

        # Wait before reading again
        time.sleep(1)

except KeyboardInterrupt:
    print("Exiting...")

finally:
    GPIO.cleanup()  # Clean up GPIO settings