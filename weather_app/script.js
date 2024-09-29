
const apiKey = 'e449571867fd033887629230e10e4d82';

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const currentLocationBtn = document.getElementById('currentLocationBtn');
    const cityInput = document.getElementById('cityInput');
    const recentCities = document.getElementById('recentCities');
    const citiesDropdown = document.getElementById('citiesDropdown');
    const weatherData = document.getElementById('weatherData');
    const locationName = document.getElementById('locationName');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const weatherIcon = document.getElementById('weatherIcon');
    const forecastData = document.getElementById('forecastData');
    const extendedForecast = document.getElementById('extendedForecast');

    let searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

    // Fetch weather data based on city name or coordinates
    async function fetchWeatherData(city = '', lat = '', lon = '') {
        try {
            let url = city 
                ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
                : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Location not found.');
            const data = await response.json();
            updateWeatherUI(data);
        } catch (error) {
            alert(error.message);
        }
    }

    // Fetch 5-day forecast data
    async function fetchExtendedForecast(city = '') {
        try {
            let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Forecast not found.');
            const data = await response.json();
            updateExtendedForecastUI(data);
        } catch (error) {
            alert(error.message);
        }
    }

    // Update weather UI with data
    function updateWeatherUI(data) {
        weatherData.classList.remove('hidden');
        locationName.textContent = data.name;
        temperature.textContent = `Temperature: ${data.main.temp}°C`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
        weatherIcon.innerHTML = getWeatherIcon(data.weather[0].main);
    }

    // Update extended forecast UI
    function updateExtendedForecastUI(data) {
        extendedForecast.classList.remove('hidden');
        forecastData.innerHTML = '';  // Clear existing data
        data.list.forEach((forecast, index) => {
            if (index % 8 === 0) {  // OpenWeatherMap provides forecast data in 3-hour intervals
                forecastData.innerHTML += `
                    <div class="p-4 bg-white border rounded-md text-center">
                        <p>${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                        <div>${getWeatherIcon(forecast.weather[0].main)}</div>
                        <p>${forecast.main.temp}°C</p>
                        <p>Wind: ${forecast.wind.speed} m/s</p>
                        <p>Humidity: ${forecast.main.humidity}%</p>
                    </div>
                `;
            }
        });
    }

    // Handle search by city name
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
            fetchExtendedForecast(city);
            addCityToHistory(city);
        } else {
            alert('Please enter a city name.');
        }
    });

    // Handle search by current location
    currentLocationBtn.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData('', latitude, longitude);
        });
    });

    // Add city to recent search history
    function addCityToHistory(city) {
        if (!searchedCities.includes(city)) {
            searchedCities.push(city);
            localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
            updateCityDropdown();
        }
    }

    // Update recent city dropdown
    function updateCityDropdown() {
        if (searchedCities.length) {
            recentCities.classList.remove('hidden');
            citiesDropdown.innerHTML = searchedCities.map(city => `<li class="p-2 bg-gray-100 cursor-pointer">${city}</li>`).join('');
        }
    }

    // Get weather icon based on condition
    function getWeatherIcon(condition) {
        switch (condition.toLowerCase()) {
            case 'clear': return '☀️';
            case 'clouds': return '☁️';
            case 'rain': return '🌧️';
            case 'snow': return '❄️';
            case 'thunderstorm': return '⛈️';
            default: return '🌤️';
        }
    }

    // Load recent cities from local storage and attach event listeners
    citiesDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const city = e.target.textContent;
            fetchWeatherData(city);
            fetchExtendedForecast(city);
        }
    });

    // Initialize recent cities on page load
    window.onload = () => {
        updateCityDropdown();
    };
});
