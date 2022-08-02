# Hardware code to build and upload to NodeMCU

## Components used in hardware
1. NodeMCU (ESP8266 )
2. DHT11 sensor (Temperature and Humidity sensor)
3. Micro sd card adapter (2gb microsd card )
4. DS3231 Real Time Clock
5. Jumper cables
6. 9V Battery

## Install PlatformIO in your IDE
##### [Installation for platformIO for visual studio code](https://platformio.org/install/ide?install=vscode)

## Diagram for pin connections with NODEMCU

##### IMAGE HERE

## Change ENV variables 
#### ./src/main.cpp:22-28
```cpp
const char *WIFI_SSID = "ESP_TEST";
const char *WIFI_PASSWORD = "hello1234"; 
const int MQTT_PORT = 1883;
const char *MQTT_SERVER = "localhost";
const int MQTT_PORT = 1883;
const char *MQTT_USERNAME = "username";
const char *MQTT_PASSWORD = "password";
const String DEVICE_ID = "1234abc";
```

## Build and upload code to NodeMCU using platformIO
#### [Reference](https://docs.platformio.org/en/latest/integration/ide/vscode.html)


