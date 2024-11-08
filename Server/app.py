import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# NodeMCU IP for sending servo commands
nodemcu_url = "http://192.168.30.1/servo-command"  # Replace with actual NodeMCU IP

# Log IR data to file
def log_ir_data_to_file(data):
    with open("ir_data_log.txt", "a") as file:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = {"timestamp": timestamp, "sensor_values": data}
        file.write(json.dumps(log_entry) + "\n")

# Check if a detected plate matches any registered plates
def is_registered_plate(plate_number):
    with open("registered_plates.json") as f:
        registered_plates = json.load(f)
    return plate_number in registered_plates["plates"]

# Request license plate recognition from mock test camera
def recognize_plate():
    return "ABC123"  # Replace with actual camera URL and request if needed

# Handle IR data from NodeMCU
@app.route('/ir-data/', methods=['POST'])
def receive_ir_data():
    data = request.json
    if 'sensor_values' not in data:
        return jsonify({"error": "Invalid data."}), 400

    log_ir_data_to_file(data['sensor_values'])

    # Detect vehicle presence at entry or exit
    for sensor in data['sensor_values']:
        
        if sensor['pin'] == 4 and sensor['value'] == 0:  # Entry gate IR sensor triggered
            print(sensor['value'])
            handle_gate_operation("entry", 1)
        elif sensor['pin'] == 5 and sensor['value'] == 0:  # Exit gate IR sensor triggered
            handle_gate_operation("exit", 2)

    return jsonify({"message": "IR data received successfully."}), 201

# Control gate operation
def handle_gate_operation(gate_type, servo_id):
    plate_number = recognize_plate()
    if plate_number and is_registered_plate(plate_number):
        send_servo_command(servo_id, 'open')  # Action "open" for entry or exit
        print(f"{gate_type.capitalize()} gate opened for plate: {plate_number}")
    else:
        send_servo_command(servo_id, 'close')  # Action "close" for non-registered plates
        print(f"{gate_type.capitalize()} gate access denied for plate: {plate_number}")

# Send command to NodeMCU to control the servo
def send_servo_command(servo_id, action):
    # Map action to angle
    angle = 180 if action == 'open' else 0  # Open means 180 degrees, close means 0 degrees
    
    # Prepare the payload in the format that the React function expects
    payload = {str(servo_id): angle}  # Dynamically setting the servo ID as the key
    
    try:
        # Send the HTTP POST request to the NodeMCU
        response = requests.post(nodemcu_url, json=payload, timeout=10)
        if response.status_code == 200:
            print(f"Servo {servo_id} {action}ed successfully.")
            print("Response:", response.json())  # Log response content if successful
        else:
            print("Failed to send command to NodeMCU.")
            print("Status code:", response.status_code)
            print("Response text:", response.text)
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")

# Endpoint to get the IR data for React (if needed)
@app.route('/ir-data/', methods=['GET'])
def get_ir_data():
    with open("ir_data_log.txt", "r") as file:
        data = file.readlines()
    return jsonify([json.loads(line) for line in data])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
