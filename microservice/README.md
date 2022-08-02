# Microservice for getting readings from hardware

#### Make sure you have python3 installed on your system

##### [Python Installation](https://docs.python-guide.org/starting/install3/linux/)

### Create a virtual environment and activate in your terminal

```bash
python3 -m venv .venv/
source ./.venv/bin/activate
```

### Install dependencies 
```bash
pip install -r requirements.txt
```

### Create env.py and add these variables

./env.py
```python
DEBUG_MODE = False
MQTT_PASSWORD = "username"
MQTT_USERNAME = "password"
MQTT_TOPIC = "/readings/#"  # Topic to subscribe to
MQTT_PORT = "1883"
MQTT_HOST = "localhost" # URL where mosquitto broker is hosted
BACKEND_HOST = "sih-api.ssrivastava.tech" # Backend url to post readings and validating them
```

### Run microservice

```bash
python microservice.py
```




