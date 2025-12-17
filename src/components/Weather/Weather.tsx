import React, { useCallback, useEffect, useState } from 'react';
import type { Location } from '../../types/weather';
import { useWeather, useLocationSearch } from '../../hooks/useWeather';
import { getWeatherGradient } from '../../utils/weather';
import SearchBar from '../SearchBar';
import CurrentWeather from '../CurrentWeather';
import HourlyForecast from '../HourlyForecast';
import DailyForecast from '../DailyForecast';
import WeatherDetails from '../WeatherDetails';
import WelcomeScreen from '../WelcomeScreen';
import GlassCard from '../GlassCard';
import './Weather.css';

export const Weather: React.FC = () => {
  const { weather, location, isLoading, error, fetchWeather, setLocation, clearError } = useWeather();
  const { results, isSearching, searchLocations, clearResults } = useLocationSearch();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLocationSelect = useCallback((loc: Location) => {
    setLocation(loc);
    fetchWeather(loc.latitude, loc.longitude);
    clearResults();
  }, [setLocation, fetchWeather, clearResults]);

  const handleQuickSearch = useCallback(async (cityName: string) => {
    await searchLocations(cityName);
  }, [searchLocations]);

  useEffect(() => {
    if (results.length > 0 && !location) {
      const popularCities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai'];
      if (popularCities.some(city => results[0].name.includes(city))) {
        handleLocationSelect(results[0]);
      }
    }
  }, [results, location, handleLocationSelect]);

  const backgroundGradient = weather
    ? getWeatherGradient(weather.current.weather_code, weather.current.is_day === 1)
    : 'var(--gradient-clear)';

  return (
    <div className="weather" style={{ background: backgroundGradient }}>
      <div className="weather__container">
        <header className="weather__header">
          <div className="weather__header-left">
            {location && (
              <button 
                className="weather__back-button"
                onClick={() => {
                  setLocation(null as unknown as Location);
                  clearResults();
                }}
                aria-label="Back to home"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </button>
            )}
          </div>

          <SearchBar
            onSearch={searchLocations}
            onSelect={handleLocationSelect}
            results={results}
            isSearching={isSearching}
            placeholder="Search for a city..."
          />

          <div className="weather__header-right">
            <div className="weather__time">
              {currentTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </div>
          </div>
        </header>

        {isLoading && (
          <div className="weather__loading">
            <div className="weather__loading-spinner" />
            <p>Loading weather data...</p>
          </div>
        )}

        {error && (
          <GlassCard className="weather__error">
            <span className="weather__error-icon">⚠️</span>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={clearError} className="weather__error-button">
              Dismiss
            </button>
          </GlassCard>
        )}

        {!location && !isLoading && !error && (
          <WelcomeScreen onQuickSearch={handleQuickSearch} />
        )}

        {weather && location && !isLoading && (
          <div className="weather__content">
            <CurrentWeather weather={weather} location={location} />
            
            <div className="weather__forecasts">
              <HourlyForecast hourly={weather.hourly} />
              <DailyForecast daily={weather.daily} />
            </div>

            <WeatherDetails weather={weather} />
          </div>
        )}

        <footer className="weather__footer">
          <p>
            Data provided by{' '}
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
              Open-Meteo
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Weather;
