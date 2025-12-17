import React from 'react';
import type { HourlyWeather } from '../../types/weather';
import { getWeatherInfo, formatTemperature, getHour } from '../../utils/weather';
import GlassCard from '../GlassCard';
import './HourlyForecast.css';

interface HourlyForecastProps {
  hourly: HourlyWeather;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly }) => {
  return (
    <GlassCard className="hourly-forecast">
      <div className="hourly-forecast__header">
        <svg
          className="hourly-forecast__header-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="hourly-forecast__title">Hourly Forecast</span>
      </div>

      <div className="hourly-forecast__scroll">
        <div className="hourly-forecast__items">
          {hourly.time.slice(0, 24).map((time, index) => {
            const weatherInfo = getWeatherInfo(hourly.weather_code[index]);
            const temp = hourly.temperature_2m[index];
            const precipProb = hourly.precipitation_probability[index];
            const hour = getHour(time);
            const isNow = hour === 'Now';

            return (
              <div
                key={time}
                className={`hourly-forecast__item ${isNow ? 'hourly-forecast__item--now' : ''}`}
              >
                <span className="hourly-forecast__time">{hour}</span>
                <span className="hourly-forecast__icon">{weatherInfo.icon}</span>
                {precipProb > 0 && (
                  <span className="hourly-forecast__precip">{precipProb}%</span>
                )}
                <span className="hourly-forecast__temp">
                  {formatTemperature(temp)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};

export default HourlyForecast;
