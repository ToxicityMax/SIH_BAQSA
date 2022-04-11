from . import env

def get_var(var_name, default="throw_error"):
    value_from_env = getattr(env, var_name, default)
    if value_from_env == "throw_error":
        raise Exception("Missing value of {var_name} in environment")
    return value_from_env

## Environment Specific Variables
class Config:
    DEBUG_MODE = get_var("DEBUG_MODE", False)
    MQTT_PASSWORD  = get_var("MQTT_PASSWORD")
    MQTT_USERNAME = get_var("MQTT_USERNAME")
    MQTT_TOPIC = get_var("MQTT_TOPIC","/readings/#")
    MQTT_PORT  = get_var("MQTT_PORT",3306)
    MQTT_HOST = get_var("MQTT_HOST")