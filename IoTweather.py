import time
import json
import random
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import threading

# AWS IoT 配置
host = "a10m4jewuy677t-ats.iot.us-east-1.amazonaws.com"  # your endpoint
certPath = "/Users/haolan/Desktop/CMPE286_Project/IoTcertificate/" 
clientId = "HaoLan's Station"
topic = "iot/temperature_humidity"

# 全局变量，用于共享数据
global_data = {"temperature": 0, "humidity": 0}

# mock data for temperature, humidity, air quality and noise level
def read_temperature():
    return random.uniform(20.0, 35.0)

def read_humidity():
    return random.uniform(30.0, 60.0)

def read_air_quality():
    return random.uniform(50.0, 150.0)  

def read_noise_level():
    return random.uniform(40.0, 80.0)  


# 初始化 AWS IoT 客户端
myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId)
myAWSIoTMQTTClient.configureEndpoint(host, 8883)
myAWSIoTMQTTClient.configureCredentials(f"{certPath}AmazonRootCA1.pem", 
                                        f"{certPath}922028dc982aee33aa12ba6e2e4cda68039aeb09ac6353f20013e7914cd67344-private.pem.key", 
                                        f"{certPath}922028dc982aee33aa12ba6e2e4cda68039aeb09ac6353f20013e7914cd67344-certificate.pem.crt")
myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)
myAWSIoTMQTTClient.configureDrainingFrequency(2)
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)
myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)
myAWSIoTMQTTClient.connect()

# AWS 数据发布函数
def publish_to_aws():
    global global_data
    while True:
        temperature = read_temperature()
        humidity = read_humidity()
        air_quality = read_air_quality()
        noise_level = read_noise_level()

        global_data = {
            "temperature": temperature,
            "humidity": humidity,
            "air_quality": air_quality,
            "noise_level": noise_level
        }
        message = json.dumps(global_data)
        myAWSIoTMQTTClient.publish(topic, message, 1)
        print(f"Published to AWS: {message}")
        time.sleep(5)

# 启动 AWS 发布线程
aws_thread = threading.Thread(target=publish_to_aws)
aws_thread.daemon = True
aws_thread.start()