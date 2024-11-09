import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Store IR sensor data
ir_data = []

# NodeMCU's IP address for sending servo commands
nodemcu_url = "http://192.168.30.1/servo-command"  # Replace with NodeMCU IP

# Log IR data to file
def log_ir_data_to_file(data):
    with open("ir_data_log.txt", "a") as file:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = {
            "timestamp": timestamp,
            "sensor_values": data
        }
        file.write(json.dumps(log_entry) + "\n")

# Endpoint to receive IR data from NodeMCU
@app.route('/ir-data/', methods=['POST'])
def receive_ir_data():
    global ir_data
    data = request.json
    if 'sensor_values' in data:
        ir_data = data['sensor_values']
        log_ir_data_to_file(ir_data)  # Log the data to a file
        return jsonify({"message": "IR data received successfully."}), 201
    return jsonify({"error": "Invalid data."}), 400

# Endpoint to get the IR data for React
@app.route('/ir-data/', methods=['GET'])
def get_ir_data():
    return jsonify(ir_data)

# Endpoint to control the servos from React
@app.route('/servo-command/', methods=['POST'])
def control_servo():
    data = request.json
    
    # Forward the servo command to NodeMCU
    try:
        response = requests.post(nodemcu_url, json=data, timeout=5)
        
        if response.status_code == 200:
            return jsonify({"message": "Command sent to NodeMCU successfully."}), 200
        else:
            return jsonify({"error": "Failed to send command to NodeMCU"}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Network error: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
