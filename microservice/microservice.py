from decimal import Decimal
import json
import time
import paho.mqtt.client as mqtt
import requests
import env
import datetime

ProductsDefaultValues = [
    {
        'name': 'wheat',
        'average_temp': 30,
        'threshold': {
            'temperature': [30, 43],
            'humidity': [20, 30],
            'accelerometer': [],
        },
    },
    {
        'name': 'rice',
        'average_temp': 28,
        'threshold': {
            'temperature': [20, 33],
            'humidity': [20, 30],
            'accelerometer': [],
        },
    },
    {
        'name': 'mangoes',
        'average_temp': 30,

        'threshold': {
            'temperature': [21, 35],
            'humidity': [20, 30],
            'accelerometer': [],
        },
    },
    {
        'name': 'sugarcane',
        'average_temp': 30,
        'threshold': {
            'temperature': [10, 25],
            'humidity': [20, 30],
            'accelerometer': [],
        },
    },
]


def get_var(var_name, default="throw_error"):
    value_from_env = getattr(env, var_name, default)
    if value_from_env == "throw_error":
        raise Exception("Missing value of {var_name} in environment")
    return value_from_env


class Config:
    DEBUG_MODE = get_var("DEBUG_MODE", False)
    MQTT_PASSWORD = get_var("MQTT_PASSWORD")
    MQTT_USERNAME = get_var("MQTT_USERNAME")
    MQTT_TOPIC = get_var("MQTT_TOPIC", "/readings/#")
    MQTT_PORT = get_var("MQTT_PORT", "1883")
    MQTT_HOST = get_var("MQTT_HOST", "127.0.0.1")
    BACKEND_HOST = get_var("BACKEND_HOST")


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
        self.data_sent_at = None

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

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connection successfull!")
        else:
            print("Bad connection returned code=", rc)
        #  Subscribe to a list of topics using a lock to guarantee that a topic is only subscribed once
        client.subscribe(self.topic)

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        device_id: str = msg.topic.rsplit('/')[2]
        payload = msg.payload.decode('utf-8')
        payload = json.loads(payload)

        temperature = float(payload.get('temperature', None))
        humidity = float(payload.get('humidity', None))
        alcohol = float(payload.get('alcohol', 170))
        # x_axis = float(payload.get('x-axis', None))
        # y_axis = float(payload.get('y-axis', None))
        # z_axis = float(payload.get('z-axis', None))
        timestamp = payload.get('timestamp', None)
        current_time = datetime.datetime.utcnow()
        print(
            f"Readings from device {device_id} on {timestamp} on topic {msg.topic}")

        # Check for faulty readings
        fault = self.readings_check(temperature, humidity)
        print(self.data_sent_at, datetime.datetime.now())

        if self.data_sent_at:
            delay = (datetime.datetime.now() -
                     self.data_sent_at).total_seconds()
            if fault and (delay > 120):
                self.send_request({
                    "device_id": device_id,
                    "temperature": temperature,
                    "humidity": humidity,
                    "alcohol": alcohol,
                    # 'x-axis': x_axis,
                    # 'y-axis': y_axis,
                    # 'z-axis': z_axis,
                    'fault': fault,
                    'timestamp': str(timestamp)
                })

            if (not fault) and (delay > 900):
                self.send_request({
                    "device_id": device_id,
                    "temperature": temperature,
                    "humidity": humidity,
                    "alcohol": alcohol,
                    # 'x-axis': x_axis,
                    # 'y-axis': y_axis,
                    # 'z-axis': z_axis,
                    'fault': fault,
                    'timestamp': str(timestamp)
                })
        else:
            self.send_request({
                "device_id": device_id,
                "temperature": temperature,
                "humidity": humidity,
                "alcohol": alcohol,
                # 'x-axis': x_axis,
                # 'y-axis': y_axis,
                # 'z-axis': z_axis,
                'fault': fault,
                'timestamp': str(timestamp)
            })

    def readings_check(self, temperature, humidity, x_axis=None, y_axis=None, z_axis=None) -> bool:
        temperature_lower_level = ProductsDefaultValues[0]['threshold']['temperature'][0]
        temperature_upper_level = ProductsDefaultValues[0]['threshold']['temperature'][1]
        humidity_lower_level = ProductsDefaultValues[0]['threshold']['humidity'][0]
        humidity_upper_level = ProductsDefaultValues[0]['threshold']['humidity'][1]
        is_temp_fault = is_humid_fault = is_shock = is_alcohol = False
        if temperature not in range(temperature_lower_level, temperature_upper_level + 1):
            is_temp_fault = True
        if humidity not in range(humidity_lower_level, humidity_upper_level + 1):
            is_humid_fault = True
        # Check for shock detection
        # is_shock = False
        # Check for alcohol value

        if is_temp_fault or is_humid_fault or is_shock or is_alcohol:
            return True
        else:
            return False

    def send_request(self, payload: dict) -> None:
        headers = {"Content-Type": "application/json"}
        response = requests.request("POST", f'{Config.BACKEND_HOST}/readings/', json=payload,
                                    headers=headers)
        self.data_sent_at = datetime.datetime.now()
        print(response.text)


if __name__ == "__main__":
    mqtt_client = MqttClient(timeout=60)
    try:
        mqtt_client.run()
    except Exception as e:
        print(e)
