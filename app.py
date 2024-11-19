import time
import json
import threading
from flask import Flask, render_template
from flask_socketio import SocketIO
from IoTweather import global_data, read_temperature, read_humidity, read_air_quality, read_noise_level

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# 初始化锁
data_lock = threading.Lock()

@app.route("/")
def dashboard():
    return render_template("dashboard.html")

# 发布到 AWS 的线程
def publish_to_aws():
    global global_data
    while True:
        temperature = read_temperature()
        humidity = read_humidity()
        air_quality = read_air_quality()
        noise_level = read_noise_level()

        # 更新 global_data 时加锁
        with data_lock:
            global_data = {
                "temperature": temperature,
                "humidity": humidity,
                "air_quality": air_quality,
                "noise_level": noise_level
            }
        print(f"Updated global_data in publish_to_aws: {global_data}")
        time.sleep(5)

# 推送到前端的线程
def push_data_to_frontend():
    while True:
        # 读取 global_data 时加锁
        with data_lock:
            data_to_send = global_data.copy()
        print(f"Pushing data to frontend: {data_to_send}")
        socketio.emit("update_data", data_to_send)
        time.sleep(5)

# 启动后台线程
thread_publish = threading.Thread(target=publish_to_aws)
thread_publish.daemon = True
thread_publish.start()

thread_push = threading.Thread(target=push_data_to_frontend)
thread_push.daemon = True
thread_push.start()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5003)
