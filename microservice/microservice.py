from decimal import Decimal
from config import Config
import json
import time
import paho.mqtt.client as mqtt
import requests

class MqttClient:
    def __init__(self, timeout=None, temperature_threshold=None) -> None:
        super(MqttClient, self).__init__()
        self.client = mqtt.Client("blockchain")
        self.host = Config.MQTT_HOST
        self.port = int(Config.MQTT_PORT)
        self.timeout = timeout
        self.topic = Config.MQTT_TOPIC
        self.username = Config.MQTT_USERNAME
        self.password = Config.MQTT_PASSWORD

    #  run method override from Thread class
    def run(self):
        self.connect_to_broker()

    def connect_to_broker(self):
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.username_pw_set(
            username=self.username,
            password=self.password)
        self.client.loop_start()
        self.client.connect(host=self.host,
                            port=self.port,
                            keepalive=self.timeout,
                            bind_address='')
        while not self.client.is_connected():
            print("waiting for connection......")
            time.sleep(1)
        while self.client.is_connected():
            pass

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        device_id: str = msg.topic.rsplit('/')[2]
        payload = msg.payload.decode('utf-8')
        payload = json.loads(payload)

        temperature = Decimal(payload.get('temperature', None))
        humidity = Decimal(payload.get('humidity', None))
        current_time = payload.get('current_time', None)

        print(
            f"\nReceived readings from device {device_id} on {current_time} on topic {msg.topic}")
        # getting device information and thresholds for temperature and humidity
        temperature_threshold = 15
        ideal_temperature_val = -40

        ideal_humidity_val = 20
        humidity_threshold = 20

        if abs(temperature-ideal_temperature_val) > temperature_threshold or abs(humidity-ideal_humidity_val) > humidity_threshold:
            # Code for faulty readings
            data = {
                "device_id":device_id,
                "temperature":temperature,
                "humidity":humidity,
                "at_time":current_time,
            }
            # requests.post(Config.BACKEND_HOST,data=data)
            print(f"\nSending faulty readings to the backend which makes a transaction on the blockhain network for device {device_id}")

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connection successfull!")
        else:
            print("Bad connection returned code=", rc)
        #  Subscribe to a list of topics using a lock to guarantee that a topic is only subscribed once
        client.subscribe(self.topic)


if __name__ == "__main__":
    mqtt_client = MqttClient(timeout=60)
    mqtt_client.run()
