// 连接到后端 WebSocket
// 确认连接成功
const socket = io();
socket.on("connect", () => {
    console.log("Connected to backend via WebSocket");
});

// 确认实时接收数据
socket.on("update_data", (data) => {
    console.log("Received data from backend:", data); // 检查是否接收到不同的数据
    // 更新页面显示
    document.getElementById("temperature").textContent = `${data.temperature.toFixed(2)}`;
    document.getElementById("humidity").textContent = `${data.humidity.toFixed(2)}`;
    document.getElementById("air_quality").textContent = `${data.air_quality.toFixed(2)}`;
    document.getElementById("noise_level").textContent = `${data.noise_level.toFixed(2)}`;

    // 更新图表
    const currentTime = new Date().toLocaleTimeString();
    if (dataChart.data.labels.length > 20) {
        dataChart.data.labels.shift();
        dataChart.data.datasets.forEach((dataset) => dataset.data.shift());
    }
    dataChart.data.labels.push(currentTime);
    dataChart.data.datasets[0].data.push(data.temperature);
    dataChart.data.datasets[1].data.push(data.humidity);
    dataChart.data.datasets[2].data.push(data.air_quality);
    dataChart.data.datasets[3].data.push(data.noise_level);
    dataChart.update();
});


// 使用 Chart.js 初始化图表
const ctx = document.getElementById("dataChart").getContext("2d");
const dataChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [], // 时间点数组
        datasets: [
            {
                label: "Temperature (°C)",
                data: [],
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                fill: true,
            },
            {
                label: "Humidity (%)",
                data: [],
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                fill: true,
            },
            {
                label: "Air Quality (AQI)",
                data: [],
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                fill: true,
            },
            {
                label: "Noise Level (dB)",
                data: [],
                borderColor: "orange",
                backgroundColor: "rgba(255, 165, 0, 0.2)",
                fill: true,
            },
        ],
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Value",
                },
            },
        },
    },
});
