const socket = io();

socket.on('update_data', (data) => {
    document.getElementById('temperature').innerText = data.temperature.toFixed(2);
    document.getElementById('humidity').innerText = data.humidity.toFixed(2);
    document.getElementById('air_quality').innerText = data.air_quality.toFixed(2);
    document.getElementById('noise_level').innerText = data.noise_level.toFixed(2);
});
