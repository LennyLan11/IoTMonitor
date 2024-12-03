// connect to socket.io
const socket = io();
socket.on("update_data", (data) => {
    console.log("Received data from backend:", data);

    document.getElementById("temperature").textContent = `${data.temperature.toFixed(2)}`;
    document.getElementById("humidity").textContent = `${data.humidity.toFixed(2)}`;
    document.getElementById("air_quality").textContent = `${data.air_quality.toFixed(2)}`;
    document.getElementById("noise_level").textContent = `${data.noise_level.toFixed(2)}`;

    const currentTime = new Date().toLocaleTimeString();

    updateChart(temperatureChart, currentTime, data.temperature);
    updateChart(humidityChart, currentTime, data.humidity);
    updateChart(airQualityChart, currentTime, data.air_quality);
    updateChart(noiseLevelChart, currentTime, data.noise_level);
});

function updateChart(chart, label, value) {
    if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(value);
    chart.update();
}

function createLineChart(ctx, label, borderColor, gradientFrom, gradientTo) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, gradientFrom);
    gradient.addColorStop(1, gradientTo);

    return new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: borderColor,
                backgroundColor: gradient,
                fill: true,
            }],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { title: { display: true, text: "Value" } },
            },
        },
    });
}

function createBarChart(ctx, label, color) {
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                backgroundColor: color,
            }],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { title: { display: true, text: "Value" } },
            },
        },
    });
}

const temperatureChart = createLineChart(
    document.getElementById("temperatureChart").getContext("2d"),
    "Temperature (°C)",
    "rgba(255, 99, 132, 1)", 
    "rgba(255, 99, 132, 0.2)", 
    "rgba(255, 99, 132, 0)" 
);
const humidityChart = createBarChart(
    document.getElementById("humidityChart").getContext("2d"),
    "Humidity (%)",
    "rgba(54, 162, 235, 0.7)"
);
const airQualityChart = createBarChart(
    document.getElementById("airQualityChart").getContext("2d"),
    "Air Quality (AQI)",
    "rgba(75, 192, 192, 0.7)"
);
const noiseLevelChart = createLineChart(
    document.getElementById("noiseLevelChart").getContext("2d"),
    "Noise Level (dB)",
    "rgba(255, 206, 86, 1)", 
    "rgba(255, 206, 86, 0.2)", 
    "rgba(255, 206, 86, 0)" 
);
