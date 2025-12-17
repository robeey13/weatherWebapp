import React from 'react';
import type { WeatherData } from '../../types/weather';
import { getUVLevel, formatVisibility, getAirQualityFromConditions, formatSunTime } from '../../utils/weather';
import GlassCard from '../GlassCard';
import './WeatherDetails.css';

interface WeatherDetailsProps {
  weather: WeatherData;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather }) => {
  const { current, daily } = weather;
  const uvInfo = getUVLevel(current.uv_index);
  const airQuality = getAirQualityFromConditions(
    current.relative_humidity_2m,
    current.visibility,
    current.weather_code
  );

  const sunrise = new Date(daily.sunrise[0]);
  const sunset = new Date(daily.sunset[0]);
  const daylightMs = sunset.getTime() - sunrise.getTime();
  const daylightHours = Math.floor(daylightMs / (1000 * 60 * 60));
  const daylightMinutes = Math.floor((daylightMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="weather-details">
      <GlassCard className="weather-details__card weather-details__card--uv">
        <div className="weather-details__card-header">
          <span className="weather-details__card-icon">☀️</span>
          <span className="weather-details__card-title">UV Index</span>
        </div>
        <div className="weather-details__uv-value">
          <span className="weather-details__uv-number">{Math.round(current.uv_index)}</span>
          <span 
            className="weather-details__uv-level"
            style={{ color: uvInfo.color }}
          >
            {uvInfo.level}
          </span>
        </div>
        <div className="weather-details__uv-bar">
          <div 
            className="weather-details__uv-bar-fill"
            style={{ 
              width: `${Math.min((current.uv_index / 11) * 100, 100)}%`,
              background: `linear-gradient(to right, #3ea72d, #fff300, #f18b00, #e53210, #b567a4)`,
            }}
          />
          <div 
            className="weather-details__uv-indicator"
            style={{ left: `${Math.min((current.uv_index / 11) * 100, 100)}%` }}
          />
        </div>
        <p className="weather-details__uv-advice">{uvInfo.advice}</p>
      </GlassCard>

      <GlassCard className="weather-details__card weather-details__card--sun">
        <div className="weather-details__card-header">
          <span className="weather-details__card-icon">🌅</span>
          <span className="weather-details__card-title">Sunrise & Sunset</span>
        </div>
        <div className="weather-details__sun-times">
          <div className="weather-details__sun-time">
            <span className="weather-details__sun-label">Sunrise</span>
            <span className="weather-details__sun-value">{formatSunTime(daily.sunrise[0])}</span>
          </div>
          <div className="weather-details__sun-arc">
            <svg viewBox="0 0 100 50" className="weather-details__sun-arc-svg">
              <path
                d="M 5 45 Q 50 -10 95 45"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 5 45 Q 50 -10 95 45"
                fill="none"
                stroke="#f9a825"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="150"
                strokeDashoffset={current.is_day ? 75 : 150}
              />
              {current.is_day === 1 && (
                <circle
                  cx="50"
                  cy="10"
                  r="6"
                  fill="#f9a825"
                  className="weather-details__sun-circle"
                />
              )}
            </svg>
          </div>
          <div className="weather-details__sun-time">
            <span className="weather-details__sun-label">Sunset</span>
            <span className="weather-details__sun-value">{formatSunTime(daily.sunset[0])}</span>
          </div>
        </div>
        <p className="weather-details__daylight">
          {daylightHours}h {daylightMinutes}m of daylight
        </p>
      </GlassCard>

      <GlassCard className="weather-details__card weather-details__card--wind">
        <div className="weather-details__card-header">
          <span className="weather-details__card-icon">💨</span>
          <span className="weather-details__card-title">Wind</span>
        </div>
        <div className="weather-details__wind-compass">
          <div className="weather-details__compass">
            <div className="weather-details__compass-labels">
              <span>N</span>
              <span>E</span>
              <span>S</span>
              <span>W</span>
            </div>
            <div 
              className="weather-details__compass-needle"
              style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
            >
              <div className="weather-details__needle-arrow" />
            </div>
            <div className="weather-details__wind-speed">
              {Math.round(current.wind_speed_10m)}
              <span>km/h</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="weather-details__card weather-details__card--precip">
        <div className="weather-details__card-header">
          <span className="weather-details__card-icon">💧</span>
          <span className="weather-details__card-title">Precipitation</span>
        </div>
        <div className="weather-details__precip-value">
          <span className="weather-details__precip-amount">
            {current.precipitation.toFixed(1)}
          </span>
          <span className="weather-details__precip-unit">mm</span>
        </div>
        <p className="weather-details__precip-label">in the last hour</p>
        {daily.precipitation_sum[0] > 0 && (
          <p className="weather-details__precip-today">
            Today: {daily.precipitation_sum[0].toFixed(1)} mm total
          </p>
        )}
      </GlassCard>

      <GlassCard className="weather-details__card weather-details__card--humidity">
        <div className="weather-details__card-header">
          <span className="weather-details__card-icon">💦</span>
          <span className="weather-details__card-title">Humidity</span>
        </div>
        <div className="weather-details__humidity-value">
          <span className="weather-details__humidity-number">
            {current.relative_humidity_2m}
          </span>
          <span className="weather-details__humidity-unit">%</span>
        </div>
        <div className="weather-details__humidity-bar">
          <div 
            className="weather-details__humidity-bar-fill"
            style={{ height: `${current.relative_humidity_2m}%` }}
          />
        </div>
        <p className="weather-details__humidity-desc">
          {current.relative_humidity_2m < 30 
            ? 'Low humidity' 
            : current.relative_humidity_2m > 70 
              ? 'High humidity' 
              : 'Comfortable'}
        </p>
      </GlassCard>

      <GlassCard className="weather-details__card weather-details__card--visibility">
        <div className="weather-details__card-header">
          <span className="weather-details__card-icon">👁️</span>
          <span className="weather-details__card-title">Visibility</span>
        </div>
        <div className="weather-details__visibility-value">
          {formatVisibility(current.visibility)}
        </div>
        <p className="weather-details__visibility-desc">
          {current.visibility >= 10000 
            ? 'Excellent visibility' 
            : current.visibility >= 5000 
              ? 'Good visibility' 
              : 'Reduced visibility'}
        </p>
      </GlassCard>

      <GlassCard className="weather-details__card weather-details__card--pressure">
        <div className="weather-details__card-header">
          <span className="weather-details__card-icon">🔽</span>
          <span className="weather-details__card-title">Pressure</span>
        </div>
        <div className="weather-details__pressure-value">
          <span className="weather-details__pressure-number">
            {Math.round(current.pressure_msl)}
          </span>
          <span className="weather-details__pressure-unit">hPa</span>
        </div>
        <p className="weather-details__pressure-desc">
          {current.pressure_msl > 1020 
            ? 'High pressure' 
            : current.pressure_msl < 1010 
              ? 'Low pressure' 
              : 'Normal pressure'}
        </p>
      </GlassCard>

      <GlassCard className="weather-details__card weather-details__card--air">
        <div className="weather-details__card-header">
          <span className="weather-details__card-icon">🌬️</span>
          <span className="weather-details__card-title">Air Quality</span>
        </div>
        <div className="weather-details__air-value">
          <span 
            className="weather-details__air-quality"
            style={{ color: airQuality.color }}
          >
            {airQuality.quality}
          </span>
        </div>
        <p className="weather-details__air-desc">
          Based on current conditions
        </p>
      </GlassCard>
    </div>
  );
};

export default WeatherDetails;
