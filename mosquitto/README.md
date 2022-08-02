# Mosquitto broker configuration (MQTT)

### Make sure you have docker installed on your system

## Docker Installation

#### For ubuntu
```bash
curl -fsSL https://get.docker.com -o get-docker.sh

sudo sh get-docker.sh
```

[Docker Installation for other distros](https://docs.docker.com/engine/install/)


## Pull mosquitto docker image

```bash
docker pull eclipse-mosquitto
```

## Install mosquitto 

```bash
sudo apt update  & sudo apt-get install mosquitto mosquitto-clients
sudo systemctl disable --now mosquitto
```
### Create username and passwd for broker
```bash
touch passwd
mosquitto_passwd -c passwd "username"
```
### Run mosquitto broker using docker with mosquitto.conf as config file
```bash
docker run -d -p 0.0.0.0:1883:1883 -v {PATH_TO_DIRECTORY}/mosquitto.conf:/
mosquitto/config/mosquitto.conf -v {PATH_TO_DIRECTORY}/passwd:/etc/mosquitto/pa
sswd -v {PATH_TO_DIRECTORY}/data:/mosquitto/data -v {PATH_TO_DIRECTORY}/mosquitto.log:/mosquitto/log/mosquitto.log eclipse-mosquitto
```

### Subscribe to a topic
```bash
mosquitto_sub -h localhost -p 1883 -u {username} -P {password} --topic /readings/#
```

### Publish to a topic
```bash
mosquitto_pub -h  localhost  -u {username} -P {password}  -t /readings/12231 -m 'Hello!'
```
