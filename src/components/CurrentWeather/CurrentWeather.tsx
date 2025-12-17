import React from 'react';
import type { WeatherData, Location } from '../../types/weather';
import { getWeatherInfo, formatTemperature, getWindDirection, formatSunTime } from '../../utils/weather';
import GlassCard from '../GlassCard';
import './CurrentWeather.css';

interface CurrentWeatherProps {
  weather: WeatherData;
  location: Location;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, location }) => {
  const { current, daily } = weather;
  const weatherInfo = getWeatherInfo(current.weather_code, current.is_day === 1);
  const todayHigh = Math.round(daily.temperature_2m_max[0]);
  const todayLow = Math.round(daily.temperature_2m_min[0]);

  return (
    <div className="current-weather">
      <div className="current-weather__header">
        <h1 className="current-weather__location">{location.name}</h1>
        <p className="current-weather__region">
          {location.admin1 && `${location.admin1}, `}
          {location.country}
        </p>
      </div>

      <div className="current-weather__main">
        <div className="current-weather__temp-container">
          <span className="current-weather__temp">
            {formatTemperature(current.temperature_2m)}
          </span>
        </div>
        
        <div className="current-weather__condition">
          <span className="current-weather__icon">{weatherInfo.icon}</span>
          <span className="current-weather__description">{weatherInfo.description}</span>
        </div>

        <div className="current-weather__high-low">
          <span>H:{todayHigh}°</span>
          <span>L:{todayLow}°</span>
        </div>
      </div>

      <div className="current-weather__details">
        <GlassCard variant="compact" className="current-weather__detail-card">
          <div className="detail-item">
            <span className="detail-item__icon">🌡️</span>
            <div className="detail-item__content">
              <span className="detail-item__label">Feels Like</span>
              <span className="detail-item__value">{formatTemperature(current.apparent_temperature)}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="compact" className="current-weather__detail-card">
          <div className="detail-item">
            <span className="detail-item__icon">💧</span>
            <div className="detail-item__content">
              <span className="detail-item__label">Humidity</span>
              <span className="detail-item__value">{current.relative_humidity_2m}%</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="compact" className="current-weather__detail-card">
          <div className="detail-item">
            <span className="detail-item__icon">💨</span>
            <div className="detail-item__content">
              <span className="detail-item__label">Wind</span>
              <span className="detail-item__value">
                {Math.round(current.wind_speed_10m)} km/h {getWindDirection(current.wind_direction_10m)}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="compact" className="current-weather__detail-card">
          <div className="detail-item">
            <span className="detail-item__icon">☀️</span>
            <div className="detail-item__content">
              <span className="detail-item__label">UV Index</span>
              <span className="detail-item__value">{Math.round(current.uv_index)}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="compact" className="current-weather__detail-card">
          <div className="detail-item">
            <span className="detail-item__icon">🌅</span>
            <div className="detail-item__content">
              <span className="detail-item__label">Sunrise</span>
              <span className="detail-item__value">{formatSunTime(daily.sunrise[0])}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="compact" className="current-weather__detail-card">
          <div className="detail-item">
            <span className="detail-item__icon">🌇</span>
            <div className="detail-item__content">
              <span className="detail-item__label">Sunset</span>
              <span className="detail-item__value">{formatSunTime(daily.sunset[0])}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="compact" className="current-weather__detail-card">
          <div className="detail-item">
            <span className="detail-item__icon">👁️</span>
            <div className="detail-item__content">
              <span className="detail-item__label">Visibility</span>
              <span className="detail-item__value">{(current.visibility / 1000).toFixed(0)} km</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="compact" className="current-weather__detail-card">
          <div className="detail-item">
            <span className="detail-item__icon">🔽</span>
            <div className="detail-item__content">
              <span className="detail-item__label">Pressure</span>
              <span className="detail-item__value">{Math.round(current.pressure_msl)} hPa</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default CurrentWeather;
