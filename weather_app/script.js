const apiKey = 'e449571867fd033887629230e10e4d82'; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherData = document.getElementById('weather-data');
const errorMessage = document.getElementById('error-message');
const recentCitiesDropdown = document.getElementById('recent-cities-dropdown');

const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

// Populate dropdown with recent cities
function populateDropdown() {
    recentCitiesDropdown.innerHTML = '';
    recentCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        recentCitiesDropdown.appendChild(option);
    });
    recentCitiesDropdown.classList.toggle('hidden', recentCities.length === 0);
}

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherData(cityName);
        cityInput.value = ''; // Clear input field
    } else {
        errorMessage.textContent = "Please enter a city name.";
    }
});

// Fetch weather data from OpenWeatherMap
async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeather(data);
        addCityToRecent(city);
        errorMessage.textContent = ""; // Clear previous error message
    } catch (error) {
        errorMessage.textContent = error.message;
        weatherData.innerHTML = ""; // Clear previous weather data
    }
}

// Display current weather
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
    getWeatherForecast(name); // Fetch extended forecast for this city
}

// Fetch extended forecast
async function getWeatherForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Could not fetch extended forecast');
        const data = await response.json();
        displayExtendedForecast(data);
    } catch (error) {
        errorMessage.textContent = error.message;
    }
}

// Display extended forecast
function displayExtendedForecast(data) {
    const forecastData = data.list.slice(0, 5).map(item => {
        return `
            <div class="border rounded p-2 mt-2">
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

// Add city to recent searches
function addCityToRecent(city) {
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
        populateDropdown();
    }
}

// Event listener for recent cities dropdown
recentCitiesDropdown.addEventListener('change', (e) => {
    const selectedCity = e.target.value;
    getWeatherData(selectedCity);
});

// Initialize dropdown
populateDropdown();
