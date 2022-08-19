#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
// #include <FS.h>
#include <PubSubClient.h>
#include <RTClib.h>
// #include <SD.h>
#include <SPI.h>
#include <Wire.h>

// DHT SENSOR VARS
#define DHTPIN D3
#define DHTYPE DHT11
DHT dht(DHTPIN, DHTYPE);
// RTC VARS
RTC_DS3231 rtc;
// SD CARD VARS
// const int chip_select = D8;

// WIFI&MQTT VARS
const char *WIFI_SSID = "ESP_TEST";
const char *WIFI_PASSWORD = "hello1234";
const char *MQTT_SERVER = "mosquitto.ssrivastava.tech";
const int MQTT_PORT = 1883;
const char *MQTT_USERNAME = "sih";
const char *MQTT_PASSWORD = "admin";
const String DEVICE_ID = "1234abc";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  Serial.print("Connecting");

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.print("\nConnected, IP address: ");
  Serial.println(WiFi.localIP());

  client.setServer(MQTT_SERVER, MQTT_PORT);
}
void setup_rtc() {
  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    while (1)
      ;
  }
  if (rtc.lostPower()) {
    Serial.println("RTC lost power, lets set the time!");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
}
// void setup_sd() {
// if (!SD.begin(chip_select, D7, D6, D5)) {
//   Serial.print("Initialization failed!");
//   while (1)
//     ;
// }
// }
void setup_sensors() {
  dht.begin();
  delay(500);
}
void mqtt_reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String client_id = "MqttEspClient-";
    client_id += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(client_id.c_str(), MQTT_USERNAME, MQTT_PASSWORD)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
      delay(2000);
    }
  }
}
void mqtt_publish(std::pair<float, float> readings, uint32_t timestamp) {
  StaticJsonDocument<256> doc;
  doc["temperature"] = 25;
  doc["humidity"] = 30;
  doc["timestamp"] = timestamp;
  char payload[128];
  serializeJson(doc, payload);
  client.publish("/readings/1", payload);
}
std::pair<float, float> getReadings() {

  return std::make_pair(dht.readTemperature(), dht.readHumidity());
}
void setup() {
  Serial.begin(115200);
  while (!Serial) {
  } // wait for serial port to connect. Needed for native USB
  Wire.begin();
  setup_rtc();
  // setup_sd();
  setup_sensors();
  setup_wifi();
  if (client.connect("NodeMcuClient", MQTT_USERNAME, MQTT_PASSWORD)) {
    Serial.println("Connected to mqtt");
  }
}

void loop() {

  if (!client.connected()) {
    mqtt_reconnect();
  }

  client.loop();
  DateTime now = rtc.now();
  std::pair<float, float> readings = getReadings();

  String data = String(now.unixtime());
  data += ",";
  // data += String(readings.first);
  data += String(32);

  data += ",";
  // data += String(readings.second);
  data += String(25);
  Serial.println(data);
  mqtt_publish(readings, now.unixtime());
  // File data_file = SD.open("filename.txt", FILE_WRITE);
  // if (data_file) {
  //   data_file.close();
  //   Serial.println("File");
  // } else {
  //   Serial.println("Error opening file");
  // }

  delay(6000);
}
