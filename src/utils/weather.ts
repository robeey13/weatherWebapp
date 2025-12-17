import type { WeatherInfo } from '../types/weather';

export const getWeatherInfo = (code: number, isDay: boolean = true): WeatherInfo => {
  const weatherMap: Record<number, WeatherInfo> = {
    0: { description: 'Clear sky', icon: isDay ? '☀️' : '🌙', category: 'clear' },
    1: { description: 'Mainly clear', icon: isDay ? '🌤️' : '🌙', category: 'clear' },
    2: { description: 'Partly cloudy', icon: '⛅', category: 'cloudy' },
    3: { description: 'Overcast', icon: '☁️', category: 'cloudy' },
    45: { description: 'Foggy', icon: '🌫️', category: 'foggy' },
    48: { description: 'Rime fog', icon: '🌫️', category: 'foggy' },
    51: { description: 'Light drizzle', icon: '🌦️', category: 'rainy' },
    53: { description: 'Moderate drizzle', icon: '🌧️', category: 'rainy' },
    55: { description: 'Dense drizzle', icon: '🌧️', category: 'rainy' },
    56: { description: 'Freezing drizzle', icon: '🌧️', category: 'rainy' },
    57: { description: 'Dense freezing drizzle', icon: '🌧️', category: 'rainy' },
    61: { description: 'Slight rain', icon: '🌧️', category: 'rainy' },
    63: { description: 'Moderate rain', icon: '🌧️', category: 'rainy' },
    65: { description: 'Heavy rain', icon: '🌧️', category: 'rainy' },
    66: { description: 'Freezing rain', icon: '🌧️', category: 'rainy' },
    67: { description: 'Heavy freezing rain', icon: '🌧️', category: 'rainy' },
    71: { description: 'Slight snow', icon: '🌨️', category: 'snowy' },
    73: { description: 'Moderate snow', icon: '❄️', category: 'snowy' },
    75: { description: 'Heavy snow', icon: '❄️', category: 'snowy' },
    77: { description: 'Snow grains', icon: '🌨️', category: 'snowy' },
    80: { description: 'Slight showers', icon: '🌦️', category: 'rainy' },
    81: { description: 'Moderate showers', icon: '🌧️', category: 'rainy' },
    82: { description: 'Violent showers', icon: '⛈️', category: 'stormy' },
    85: { description: 'Slight snow showers', icon: '🌨️', category: 'snowy' },
    86: { description: 'Heavy snow showers', icon: '❄️', category: 'snowy' },
    95: { description: 'Thunderstorm', icon: '⛈️', category: 'stormy' },
    96: { description: 'Thunderstorm with hail', icon: '⛈️', category: 'stormy' },
    99: { description: 'Severe thunderstorm', icon: '⛈️', category: 'stormy' },
  };

  return weatherMap[code] || { description: 'Unknown', icon: '❓', category: 'clear' };
};

export const getWeatherGradient = (code: number, isDay: boolean): string => {
  const info = getWeatherInfo(code, isDay);
  
  if (!isDay) {
    return 'var(--gradient-night)';
  }
  
  switch (info.category) {
    case 'clear':
      return 'var(--gradient-clear)';
    case 'cloudy':
      return 'var(--gradient-cloudy)';
    case 'rainy':
      return 'var(--gradient-rainy)';
    case 'stormy':
      return 'var(--gradient-stormy)';
    case 'snowy':
      return 'var(--gradient-snowy)';
    case 'foggy':
      return 'var(--gradient-cloudy)';
    default:
      return 'var(--gradient-clear)';
  }
};

export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string => {
  if (unit === 'fahrenheit') {
    return `${Math.round(temp * 9/5 + 32)}°F`;
  }
  return `${Math.round(temp)}°`;
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getUVLevel = (index: number): { level: string; color: string; advice: string } => {
  if (index <= 2) {
    return { level: 'Low', color: '#3ea72d', advice: 'No protection needed' };
  } else if (index <= 5) {
    return { level: 'Moderate', color: '#fff300', advice: 'Seek shade during midday' };
  } else if (index <= 7) {
    return { level: 'High', color: '#f18b00', advice: 'Reduce sun exposure' };
  } else if (index <= 10) {
    return { level: 'Very High', color: '#e53210', advice: 'Extra protection needed' };
  } else {
    return { level: 'Extreme', color: '#b567a4', advice: 'Avoid outdoor exposure' };
  }
};

export const formatVisibility = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
};

export const formatPressure = (hPa: number): string => {
  return `${Math.round(hPa)} hPa`;
};

export const getDayName = (dateString: string, index: number): string => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const formatTime = (timeString: string, use24h: boolean = false): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24h,
  });
};

export const getHour = (timeString: string): string => {
  const date = new Date(timeString);
  const now = new Date();
  
  if (date.getHours() === now.getHours() && date.getDate() === now.getDate()) {
    return 'Now';
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatSunTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getAirQualityFromConditions = (
  humidity: number,
  visibility: number,
  weatherCode: number
): { quality: string; color: string } => {
  if (weatherCode === 45 || weatherCode === 48 || visibility < 5000) {
    return { quality: 'Moderate', color: '#fff300' };
  }
  if (humidity > 85 && visibility < 10000) {
    return { quality: 'Fair', color: '#f18b00' };
  }
  return { quality: 'Good', color: '#3ea72d' };
};
