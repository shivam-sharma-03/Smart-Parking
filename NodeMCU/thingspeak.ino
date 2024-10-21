#include <ESP8266WiFi.h>
#include <ThingSpeak.h>

// WiFi credentials
const char* ssid = "Redmi K50i";           // Your WiFi SSID
const char* password = "Shivam sharma";     // Your WiFi Password

// ThingSpeak API
unsigned long myChannelNumber = 2680906; // Your ThingSpeak Channel ID
const char* myWriteAPIKey = "W3Q9ZK7ACV764SGM";  // Your ThingSpeak Write API Key

WiFiClient client;

// Pin definition for IR sensor
const int irPin = A0; // IR sensor pin

void setup() {
  Serial.begin(9600);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected!");

  // Initialize ThingSpeak
  ThingSpeak.begin(client);
}

void loop() {
  // Read the IR sensor value (0 to 1023)
  int irValue = analogRead(irPin);
  Serial.print("IR Sensor Value: ");
  Serial.println(irValue);

  // Upload the IR sensor value to ThingSpeak
  ThingSpeak.setField(1, irValue);
  int responseCode = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);

  if (responseCode == 200) {
    Serial.println("Data uploaded to ThingSpeak successfully.");
  } else {
    Serial.println("Failed to upload data.");
  }

  // Wait for 15 seconds (ThingSpeak update rate limit)
  delay(15000);
}
