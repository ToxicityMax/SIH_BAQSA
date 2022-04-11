from threading import Thread
from decimal import Decimal
from .config import (MQTT_PASSWORD, MQTT_USERNAME,
                     MQTT_TOPIC, MQTT_PORT, MQTT_HOST)
import json
import paho.mqtt.client as mqtt

class MqttClient(Thread):
    def __init__(self, timeout=None,temperature_threshold=None) -> None:
        super(MqttClient, self).__init__()
        self.client = mqtt.Client()
        self.broker = MQTT_HOST
        self.port = MQTT_PORT
        self.timeout = timeout
        self.topic = MQTT_TOPIC
        self.username = MQTT_USERNAME
        self.password = MQTT_PASSWORD

    #  run method override from Thread class
    def run(self):
        self.connect_to_broker()

    def connect_to_broker(self):
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.username_pw_set(
            username=self.username, password=self.password)
        self.client.connect(self.broker, self.port, self.timeout)
        self.client.loop_start()

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        payload = Decimal(msg.payload.decode('utf-8'))
        topic: str = msg.topic.rsplit('/')[1]

        payload = json.loads(payload)
        
        temperature = payload.get('temperature')
        humidity = payload.get('humidity')
        current_time = payload.get('current_time')
        device_id = payload.get('device_id')

        print(topic, payload)

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(self, client, userdata, flags, rc):
        #  Subscribe to a list of topics using a lock to guarantee that a topic is only subscribed once
        client.subscribe(self.topic)


if __name__ == "__main__":
    MqttClient(timeout=60,temperature_threshold=40).start()
