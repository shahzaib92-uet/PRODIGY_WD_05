document.addEventListener('DOMContentLoaded', () => {
    const weatherInfo = document.getElementById('weather-info');
    const form = document.getElementById('location-form');
    const input = document.getElementById('location-input');

    // Initialize the map
    const map = L.map('map').setView([51.505, -0.09], 13); // Default view is set to London

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker;

    map.on('click', (e) => {
        const { lat, lng } = e.latlng;

        if (marker) {
            marker.setLatLng([lat, lng]);
        } else {
            marker = L.marker([lat, lng]).addTo(map);
        }

        getWeather(lat, lng);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const location = input.value.trim();
        if (location) {
            getCoordinates(location);
        }
    });

    function getCoordinates(location) {
        const apiKey = '8ad733f340d9e46cbeaf5a29d32fec1a'; // Replace with your OpenWeatherMap API key
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    map.setView([lat, lon], 13);
                    if (marker) {
                        marker.setLatLng([lat, lon]);
                    } else {
                        marker = L.marker([lat, lon]).addTo(map);
                    }
                    getWeather(lat, lon);
                } else {
                    weatherInfo.innerHTML = '<p>Location not found</p>';
                }
            })
            .catch(error => console.error('Error fetching coordinates:', error));
    }

    function getWeather(lat, lon) {
        const apiKey = '8ad733f340d9e46cbeaf5a29d32fec1a'; // Replace with your OpenWeatherMap API key
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => displayWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function displayWeather(data) {
        if (data.cod === 200) {
            const { name, main, weather } = data;
            weatherInfo.innerHTML = `
                <h2>${name}</h2>
                <p><strong>Weather:</strong> ${weather[0].description}</p>
                <p><strong>Temperature:</strong> ${main.temp}°C</p>
                <p><strong>Humidity:</strong> ${main.humidity}%</p>
            `;
        } else {
            weatherInfo.innerHTML = '<p>Location not found</p>';
        }
    }

    // Get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13);
            marker = L.marker([latitude, longitude]).addTo(map);
            getWeather(latitude, longitude);
        });
    }
});
