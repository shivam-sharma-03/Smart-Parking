#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include <Servo.h>

// WiFi credentials
const char* ssid = "Redmi K50i";
const char* password = "Shivam sharma";

// Flask server URL for sending IR data
const char* serverUrl = "http://192.168.30.143:8000/ir-data/";

// Servo objects and pins
Servo servo1, servo2;
const int servoPin1 = 2;
const int servoPin2 = 14;

// IR sensor pins
const int irPins[] = {16, 5, 4, 0};

// HTTP client and server
WiFiClient client;
HTTPClient http;
ESP8266WebServer server(80);

void setup() {
  Serial.begin(9600);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.print("Connected to WiFi.\nIP address: ");
  Serial.println(WiFi.localIP());
Serial.print("Wifi Status: ");
  Serial.println(WiFi.status());

  // Attach servos to specified pins
  servo1.attach(servoPin1);
  servo2.attach(servoPin2);
  servo1.write(90);  // Set initial position
  servo2.write(90);

  // Define the endpoint to receive servo commands
  server.on("/servo-command", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, server.arg("plain"));

      if (!error) {
        int servo1Angle = doc["servo1"];
        int servo2Angle = doc["servo2"];
        servo1.write(servo1Angle);
        servo2.write(servo2Angle);
        
        server.send(200, "application/json", "{\"status\":\"success\"}");
        Serial.printf("Moved servo1 to %d and servo2 to %d\n", servo1Angle, servo2Angle);
      } else {
        server.send(400, "application/json", "{\"error\":\"Invalid JSON format\"}");
      }
    } else {
      server.send(400, "application/json", "{\"error\":\"No data received\"}");
    }
  });

  // Start the server
  server.begin();
  Serial.println("Server started");
}

void loop() {
  // Handle incoming servo command requests
  server.handleClient();
  
  // Send IR sensor data to Flask server
  sendIrData();
  delay(1000);  // Send every second
}

void sendIrData() {
  int irValues[4];
  for (int i = 0; i < 4; i++) {
    irValues[i] = digitalRead(irPins[i]);
  }

  if (WiFi.status() == WL_CONNECTED) {
    // Prepare JSON document to hold the data
    StaticJsonDocument<200> doc;
    JsonArray sensor_values = doc.createNestedArray("sensor_values");

    // Populate sensor_values array with each sensor's pin and value
    for (int i = 0; i < 4; i++) {
      JsonObject sensor = sensor_values.createNestedObject();
      sensor["pin"] = irPins[i];        // Store the pin number
      sensor["value"] = irValues[i];    // Store the IR sensor value
    }

    // Convert JSON document to string
    String payload;
    serializeJson(doc, payload);

    // Send the HTTP POST request
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode == 201) {
      Serial.println("IR data sent successfully");
    } else {
      Serial.printf("Error sending IR data, code: %d\n", httpResponseCode);
    }
    http.end();
  }
}
