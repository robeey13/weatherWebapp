import React from 'react';
import type { DailyWeather } from '../../types/weather';
import { getWeatherInfo, formatTemperature, getDayName, formatDate } from '../../utils/weather';
import GlassCard from '../GlassCard';
import './DailyForecast.css';

interface DailyForecastProps {
  daily: DailyWeather;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily }) => {
  const allTemps = [...daily.temperature_2m_max, ...daily.temperature_2m_min];
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const tempRange = maxTemp - minTemp;

  const getBarStyle = (low: number, high: number) => {
    const leftPercent = tempRange > 0 ? ((low - minTemp) / tempRange) * 100 : 0;
    const widthPercent = tempRange > 0 ? ((high - low) / tempRange) * 100 : 100;
    
    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 10)}%`,
    };
  };

  return (
    <GlassCard className="daily-forecast">
      <div className="daily-forecast__header">
        <svg
          className="daily-forecast__header-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
        <span className="daily-forecast__title">10-Day Forecast</span>
      </div>

      <div className="daily-forecast__list">
        {daily.time.map((date, index) => {
          const weatherInfo = getWeatherInfo(daily.weather_code[index]);
          const high = Math.round(daily.temperature_2m_max[index]);
          const low = Math.round(daily.temperature_2m_min[index]);
          const precipProb = daily.precipitation_probability_max[index];
          const isToday = index === 0;

          return (
            <div
              key={date}
              className={`daily-forecast__item ${isToday ? 'daily-forecast__item--today' : ''}`}
            >
              <div className="daily-forecast__day">
                <span className="daily-forecast__day-name">{getDayName(date, index)}</span>
                {!isToday && (
                  <span className="daily-forecast__date">{formatDate(date)}</span>
                )}
              </div>

              <div className="daily-forecast__weather">
                <span className="daily-forecast__icon">{weatherInfo.icon}</span>
                {precipProb > 0 && (
                  <span className="daily-forecast__precip">{precipProb}%</span>
                )}
              </div>

              <div className="daily-forecast__temps">
                <span className="daily-forecast__temp-low">
                  {formatTemperature(low)}
                </span>

                <div className="daily-forecast__temp-bar">
                  <div
                    className="daily-forecast__temp-bar-fill"
                    style={getBarStyle(low, high)}
                  />
                </div>

                <span className="daily-forecast__temp-high">
                  {formatTemperature(high)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default DailyForecast;
