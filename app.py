from flask import Flask, render_template
from flask_socketio import SocketIO
import threading
import time

from IoTweather import global_data

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# 路由：渲染仪表盘页面
@app.route('/')
def dashboard():
    return render_template('dashboard.html')

# 数据推送线程
def send_data():
    while True:
        socketio.emit('update_data', global_data)  # 推送包含所有数据的 global_data
        time.sleep(2)  # 每 2 秒推送一次

# 启动数据推送线程
data_thread = threading.Thread(target=send_data)
data_thread.daemon = True
data_thread.start()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5003)
