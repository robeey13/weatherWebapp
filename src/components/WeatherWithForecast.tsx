import React, { useState, useEffect, useRef } from 'react';
import './WeatherWithForecast.css';

// Type definitions
interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    wind_speed_10m_max: string;
  };
}

interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

const WeatherWithForecast: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Search for locations
  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setLocationResults([]);
      return;
    }

    setSearchLoading(true);
    setError(null);
    
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setLocationResults(data.results);
      } else {
        setLocationResults([]);
        setError(`No locations found for "${query}"`);
      }
    } catch (err) {
      console.error('Error searching locations:', err);
      setError('Failed to search locations. Please try again.');
      setLocationResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (query.length < 2) {
      setLocationResults([]);
      setError(null);
      return;
    }
    
    debounceTimer.current = setTimeout(() => {
      searchLocations(query);
    }, 500);
  };

  // Fetch weather with forecast
  const fetchWeatherWithForecast = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error! status: ${response.status}`);
      }
      
      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationResult) => {
    setSelectedLocation(location);
    setLocationResults([]);
    setSearchQuery('');
    fetchWeatherWithForecast(location.latitude, location.longitude);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Weather code to description and emoji mapping
  const getWeatherInfo = (code: number): { description: string; emoji: string } => {
    const weatherInfo: { [key: number]: { description: string; emoji: string } } = {
      0: { description: 'Clear sky', emoji: '☀️' },
      1: { description: 'Mainly clear', emoji: '🌤️' },
      2: { description: 'Partly cloudy', emoji: '⛅' },
      3: { description: 'Overcast', emoji: '☁️' },
      45: { description: 'Fog', emoji: '🌫️' },
      48: { description: 'Depositing rime fog', emoji: '🌫️' },
      51: { description: 'Light drizzle', emoji: '🌦️' },
      53: { description: 'Moderate drizzle', emoji: '🌦️' },
      55: { description: 'Dense drizzle', emoji: '🌧️' },
      61: { description: 'Slight rain', emoji: '🌧️' },
      63: { description: 'Moderate rain', emoji: '🌧️' },
      65: { description: 'Heavy rain', emoji: '⛈️' },
      71: { description: 'Slight snow fall', emoji: '🌨️' },
      73: { description: 'Moderate snow fall', emoji: '❄️' },
      75: { description: 'Heavy snow fall', emoji: '❄️' },
      95: { description: 'Thunderstorm', emoji: '⛈️' },
    };
    return weatherInfo[code] || { description: `Unknown (code: ${code})`, emoji: '❓' };
  };

  // Get background gradient based on weather
  const getWeatherGradient = (weatherCode: number): string => {
    if (weatherCode === 0 || weatherCode === 1) {
      return 'var(--gradient-sunny)';
    } else if (weatherCode === 2 || weatherCode === 3) {
      return 'var(--gradient-cloudy)';
    } else if (weatherCode >= 61 && weatherCode <= 65) {
      return 'var(--gradient-rainy)';
    } else if (weatherCode >= 71 && weatherCode <= 75) {
      return 'var(--gradient-snowy)';
    } else if (weatherCode === 95) {
      return 'var(--gradient-stormy)';
    }
    return 'var(--gradient-default)';
  };

  // Format location display name
  const formatLocationName = (location: LocationResult): string => {
    let name = location.name;
    if (location.admin1) name += `, ${location.admin1}`;
    name += `, ${location.country}`;
    return name;
  };

  // Get day name from date string
  const getDayName = (dateString: string, index: number): string => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Get formatted date
  const getFormattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className="weather-app"
      style={{
        background: weather ? getWeatherGradient(weather.current.weather_code) : 'var(--gradient-default)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="floating-cloud cloud-1"></div>
        <div className="floating-cloud cloud-2"></div>
        <div className="floating-cloud cloud-3"></div>
        <div className="rain-drops"></div>
      </div>

      <div className="weather-container">
        {/* Header Section with Time */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon">🌤️</span>
              Weather Forecast
            </h1>
            <div className="current-time">
              <div className="time-display">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="date-display">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>
        
        {/* Search Section */}
        <div className="search-section">
          <div className="search-glass-card">
            <div className="search-input-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for any city worldwide..."
                className="search-input"
              />
              {searchLoading && <div className="search-spinner">🌀</div>}
            </div>
            
            {/* Quick test buttons */}
            <div className="quick-buttons">
              <span className="quick-label">Popular Cities:</span>
              {['New York', 'London', 'Tokyo', 'Sydney', 'Paris', 'Dubai'].map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSearchQuery(city);
                    searchLocations(city);
                  }}
                  className="quick-button"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {locationResults.length > 0 && (
          <div className="search-results">
            <div className="results-header">
              <span className="results-count">{locationResults.length} locations found</span>
            </div>
            {locationResults.map((location, index) => (
              <div
                key={`${location.id}-${index}`}
                onClick={() => handleLocationSelect(location)}
                className="search-result-item"
              >
                <div className="location-icon">📍</div>
                <div className="location-info">
                  <div className="location-name">{location.name}</div>
                  <div className="location-details">
                    {location.admin1 && `${location.admin1}, `}{location.country}
                  </div>
                </div>
                <div className="select-arrow">→</div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Location */}
        {selectedLocation && (
          <div className="selected-location">
            <div className="location-pin">📍</div>
            <div className="selected-info">
              <div className="selected-name">{formatLocationName(selectedLocation)}</div>
              <div className="coordinates">
                {selectedLocation.latitude.toFixed(4)}°, {selectedLocation.longitude.toFixed(4)}°
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-container">
            <div className="loading-animation">
              <div className="loading-spinner">🌀</div>
              <div className="loading-text">
                <h3>Loading Weather Data</h3>
                <p>Fetching the latest forecast...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button 
                onClick={() => setError(null)}
                className="error-dismiss"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Weather Content */}
        {weather && selectedLocation && !loading && (
          <div className="weather-content">
            {/* Current Weather Hero Section */}
            <div className="current-weather-hero">
              <div className="hero-background">
                <div className="weather-particles"></div>
              </div>
              
              <div className="hero-content">
                <div className="weather-main">
                  <div className="temperature-display">
                    <span className="temp-number">{Math.round(weather.current.temperature_2m)}</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <div className="weather-icon-large">
                    {getWeatherInfo(weather.current.weather_code).emoji}
                  </div>
                </div>
                
                <div className="weather-description-large">
                  {getWeatherInfo(weather.current.weather_code).description}
                </div>

                <div className="weather-stats">
                  <div className="stat-item">
                    <div className="stat-icon">💧</div>
                    <div className="stat-content">
                      <div className="stat-value">{weather.current.relative_humidity_2m}%</div>
                      <div className="stat-label">Humidity</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">💨</div>
                    <div className="stat-content">
                      <div className="stat-value">{weather.current.wind_speed_10m}</div>
                      <div className="stat-label">Wind km/h</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">🌡️</div>
                    <div className="stat-content">
                      <div className="stat-value">Feels like</div>
                      <div className="stat-label">{Math.round(weather.current.temperature_2m + 2)}°C</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="forecast-section">
              <div className="section-header">
                <h2 className="forecast-title">
                  <span className="title-icon">📅</span>
                  7-Day Forecast
                </h2>
              </div>
              
              <div className="forecast-grid">
                {weather.daily.time.map((date, index) => {
                  const weatherInfo = getWeatherInfo(weather.daily.weather_code[index]);
                  const maxTemp = Math.round(weather.daily.temperature_2m_max[index]);
                  const minTemp = Math.round(weather.daily.temperature_2m_min[index]);
                  const precipitation = weather.daily.precipitation_sum[index];
                  const windSpeed = weather.daily.wind_speed_10m_max[index];
                  
                  return (
                    <div
                      key={date}
                      className={`forecast-card ${index === 0 ? 'today-card' : ''}`}
                    >
                      <div className="forecast-header">
                        <div className="forecast-day-info">
                          <div className="day-name">
                            {getDayName(date, index)}
                          </div>
                          <div className="day-date">
                            {getFormattedDate(date)}
                          </div>
                        </div>
                        <div className="forecast-weather-icon">
                          {weatherInfo.emoji}
                        </div>
                      </div>

                      <div className="forecast-body">
                        <div className="weather-condition">
                          {weatherInfo.description}
                        </div>
                        
                        <div className="temperature-range-visual">
                          <div className="temp-range-bar">
                            <div className="temp-min-marker" style={{ left: '10%' }}>
                              <span>{minTemp}°</span>
                            </div>
                            <div 
                              className={`temp-range-fill ${
                                maxTemp > 25 ? 'hot' : maxTemp > 15 ? 'warm' : 'cool'
                              }`}
                              style={{
                                left: '10%',
                                width: `${Math.min(80, Math.max(20, ((maxTemp - minTemp) / 30) * 60))}%`
                              }}
                            />
                            <div className="temp-max-marker" style={{ right: '10%' }}>
                              <span>{maxTemp}°</span>
                            </div>
                          </div>
                        </div>

                        <div className="forecast-details">
                          {precipitation > 0 && (
                            <div className="detail-chip precipitation">
                              <span className="chip-icon">💧</span>
                              <span>{precipitation.toFixed(1)}mm</span>
                            </div>
                          )}
                          <div className="detail-chip wind">
                            <span className="chip-icon">💨</span>
                            <span>{windSpeed.toFixed(0)} km/h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!selectedLocation && !loading && locationResults.length === 0 && !error && (
          <div className="welcome-section">
            <div className="welcome-content">
              <div className="welcome-icon">🌍</div>
              <h2 className="welcome-title">Discover Weather Worldwide</h2>
              <p className="welcome-description">
                Search for any city to get detailed weather information and 7-day forecasts.
                Experience beautiful, real-time weather data from around the globe.
              </p>
              <div className="welcome-features">
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Accurate Forecasts</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌐</span>
                  <span>Global Coverage</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Mobile Optimized</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWithForecast;