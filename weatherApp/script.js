  const apiKey = "683c946e1a3e32bafd54aeb29377e095";
        const baseUrl = "https://api.openweathermap.org/data/2.5/";
        
        // DOM-Elemente
        const cityInput = document.getElementById('city-input');
        const searchBtn = document.getElementById('search-btn');
        const currentWeather = document.getElementById('current-weather');
        const forecastContainer = document.getElementById('forecast');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        
        // Elemente für aktuelle Wetterdaten
        const cityName = document.getElementById('city-name');
        const currentDate = document.getElementById('current-date');
        const weatherIcon = document.getElementById('weather-icon');
        const temperature = document.getElementById('temperature');
        const description = document.getElementById('description');
        const windSpeed = document.getElementById('wind-speed');
        const humidity = document.getElementById('humidity');
        const feelsLike = document.getElementById('feels-like');
        
        // Initialisierung
        document.addEventListener('DOMContentLoaded', () => {
            // Aktuelles Datum anzeigen
            updateDate();
            
            // Standardstadt laden (Berlin)
            getWeatherData('Berlin');
            
            // Event Listener für Suchbutton
            searchBtn.addEventListener('click', () => {
                const city = cityInput.value.trim();
                if (city) {
                    getWeatherData(city);
                }
            });
            
            // Event Listener für Enter-Taste
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const city = cityInput.value.trim();
                    if (city) {
                        getWeatherData(city);
                    }
                }
            });
        });
        
        // Funktion zum Abrufen der Wetterdaten
        async function getWeatherData(city) {
            // Ladeanimation anzeigen
            loading.style.display = 'block';
            error.style.display = 'none';
            
            try {
                // Aktuelle Wetterdaten abrufen
                const currentWeatherResponse = await fetch(
                    `${baseUrl}weather?q=${city}&units=metric&appid=${apiKey}&lang=de`
                );
                
                if (!currentWeatherResponse.ok) {
                    throw new Error('Stadt nicht gefunden');
                }
                
                const currentData = await currentWeatherResponse.json();
                
                // 5-Tage-Vorhersage abrufen
                const forecastResponse = await fetch(
                    `${baseUrl}forecast?q=${city}&units=metric&appid=${apiKey}&lang=de`
                );
                
                const forecastData = await forecastResponse.json();
                
                // Daten anzeigen
                displayCurrentWeather(currentData);
                displayForecast(forecastData);
                
                // Hintergrund basierend auf Wetterbedingungen ändern
                changeBackground(currentData.weather[0].main);
                
            } catch (err) {
                error.style.display = 'block';
                console.error('Fehler beim Abrufen der Wetterdaten:', err);
            } finally {
                loading.style.display = 'none';
            }
        }
        
        // Funktion zum Anzeigen der aktuellen Wetterdaten
        function displayCurrentWeather(data) {
            cityName.textContent = `${data.name}, ${data.sys.country}`;
            temperature.textContent = Math.round(data.main.temp);
            description.textContent = data.weather[0].description;
            windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
            humidity.textContent = `${data.main.humidity}%`;
            feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
            
            // Wetter-Icon setzen
            const iconCode = data.weather[0].icon;
            weatherIcon.className = getWeatherIcon(iconCode);
        }
        
        // Funktion zum Anzeigen der 5-Tage-Vorhersage
        function displayForecast(data) {
            // Container leeren
            forecastContainer.innerHTML = '';
            
            // Daten für die nächsten 5 Tage filtern (jeden Tag um 12:00)
            const dailyForecasts = data.list.filter(item => 
                item.dt_txt.includes('12:00:00')
            ).slice(0, 5);
            
            // Wochentage
            const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
            
            dailyForecasts.forEach(day => {
                const date = new Date(day.dt * 1000);
                const dayName = days[date.getDay()];
                
                const forecastItem = document.createElement('div');
                forecastItem.className = 'forecast-item';
                
                forecastItem.innerHTML = `
                    <div class="forecast-day">${dayName}</div>
                    <div class="forecast-icon">
                        <i class="${getWeatherIcon(day.weather[0].icon)}"></i>
                    </div>
                    <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
                    <div class="forecast-desc">${day.weather[0].description}</div>
                `;
                
                forecastContainer.appendChild(forecastItem);
            });
        }
        
        // Funktion zum Ermitteln des Wetter-Icons
        function getWeatherIcon(iconCode) {
            const iconMap = {
                '01d': 'fas fa-sun',
                '01n': 'fas fa-moon',
                '02d': 'fas fa-cloud-sun',
                '02n': 'fas fa-cloud-moon',
                '03d': 'fas fa-cloud',
                '03n': 'fas fa-cloud',
                '04d': 'fas fa-cloud',
                '04n': 'fas fa-cloud',
                '09d': 'fas fa-cloud-rain',
                '09n': 'fas fa-cloud-rain',
                '10d': 'fas fa-cloud-sun-rain',
                '10n': 'fas fa-cloud-moon-rain',
                '11d': 'fas fa-bolt',
                '11n': 'fas fa-bolt',
                '13d': 'fas fa-snowflake',
                '13n': 'fas fa-snowflake',
                '50d': 'fas fa-smog',
                '50n': 'fas fa-smog'
            };
            
            return iconMap[iconCode] || 'fas fa-cloud';
        }
        
        // Funktion zum Ändern des Hintergrunds basierend auf dem Wetter
        function changeBackground(weatherCondition) {
            const body = document.body;
            
            const gradients = {
                'Clear': 'linear-gradient(135deg, #1e3c72, #2a5298)',
                'Clouds': 'linear-gradient(135deg, #636363, #a2ab58)',
                'Rain': 'linear-gradient(135deg, #373B44, #4286f4)',
                'Drizzle': 'linear-gradient(135deg, #373B44, #4286f4)',
                'Thunderstorm': 'linear-gradient(135deg, #23074d, #cc5333)',
                'Snow': 'linear-gradient(135deg, #1c92d2, #f2fcfe)',
                'Mist': 'linear-gradient(135deg, #606c88, #3f4c6b)',
                'Fog': 'linear-gradient(135deg, #606c88, #3f4c6b)',
                'Haze': 'linear-gradient(135deg, #606c88, #3f4c6b)'
            };
            
            body.style.background = gradients[weatherCondition] || 'linear-gradient(135deg, #1e3c72, #2a5298)';
        }
        
        // Funktion zum Aktualisieren des Datums
        function updateDate() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            currentDate.textContent = now.toLocaleDateString('de-DE', options);
        }