#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Redmi K50i";
const char* password = "Shivam sharma";

const char* serverUrl = "http://192.168.30.143:8000/ir-data/"; // Django backend URL

WiFiClient client;
HTTPClient http;

const int irPin = A0;

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");
}

void loop() {
  int irValue = analogRead(irPin);
  
  if (WiFi.status() == WL_CONNECTED) {
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Create JSON payload
    String payload = "{\"source\":\"nodemcu\",\"sensor_value\":" + String(irValue) + "}";

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode == 201) {
      Serial.println("Data sent successfully");
    } else {
      Serial.printf("Error code: %d\n", httpResponseCode);
    }

    http.end();
  }

  delay(1000);  // Send data every second
}