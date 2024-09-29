const apiKey = 'e449571867fd033887629230e10e4d82'; // Replace with your API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherData = document.getElementById('weather-data');
const errorMessage = document.getElementById('error-message');

searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherData(cityName);
    } else {
        errorMessage.textContent = "Please enter a city name.";
    }
});

async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeather(data);
        errorMessage.textContent = ""; // Clear error message
    } catch (error) {
        errorMessage.textContent = error.message;
        weatherData.innerHTML = ""; // Clear previous data
    }
}

function displayWeather(data) {
    const { main, weather, wind, name } = data;
    weatherData.innerHTML = `
        <h2 class="text-lg font-semibold">${name}</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>Condition: ${weather[0].description}</p>
        <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
    `;
}
const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
const recentCitiesDropdown = document.createElement('select');
recentCitiesDropdown.id = 'recent-cities-dropdown';
recentCitiesDropdown.className = 'border rounded p-2 mt-2 w-full';
document.body.appendChild(recentCitiesDropdown);

recentCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    recentCitiesDropdown.appendChild(option);
});

recentCitiesDropdown.addEventListener('change', (e) => {
    getWeatherData(e.target.value);
});

function addCityToRecent(city) {
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
}

async function getWeatherData(city) {
    // existing code...
    addCityToRecent(city);
}
async function getWeatherForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayExtendedForecast(data);
    } catch (error) {
        errorMessage.textContent = error.message;
    }
}

function displayExtendedForecast(data) {
    const forecastData = data.list.slice(0, 5).map(item => {
        return `
            <div class="border rounded p-2">
                <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                <p>Temp: ${item.main.temp} °C</p>
                <p>Humidity: ${item.main.humidity}%</p>
                <p>Wind: ${item.wind.speed} m/s</p>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
            </div>
        `;
    }).join('');
    weatherData.innerHTML += `<div class="mt-4">${forecastData}</div>`;
}
