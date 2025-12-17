import { useState, useCallback } from 'react';
import type { WeatherData, Location, GeocodingResponse } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

interface UseWeatherReturn {
  weather: WeatherData | null;
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  setLocation: (location: Location) => void;
  clearError: () => void;
}

export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'weather_code',
          'wind_speed_10m',
          'wind_direction_10m',
          'uv_index',
          'visibility',
          'pressure_msl',
        ].join(','),
        hourly: [
          'temperature_2m',
          'weather_code',
          'precipitation_probability',
          'wind_speed_10m',
        ].join(','),
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'weather_code',
          'precipitation_sum',
          'precipitation_probability_max',
          'wind_speed_10m_max',
          'uv_index_max',
          'sunrise',
          'sunset',
        ].join(','),
        timezone: 'auto',
        forecast_days: '10',
        forecast_hours: '24',
      });

      const response = await fetch(`${WEATHER_API}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    weather,
    location,
    isLoading,
    error,
    fetchWeather,
    setLocation,
    clearError,
  };
};

interface UseLocationSearchReturn {
  results: Location[];
  isSearching: boolean;
  searchError: string | null;
  searchLocations: (query: string) => Promise<void>;
  clearResults: () => void;
}

export const useLocationSearch = (): UseLocationSearchReturn => {
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const params = new URLSearchParams({
        name: query,
        count: '8',
        language: 'en',
        format: 'json',
      });

      const response = await fetch(`${GEOCODING_API}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const data: GeocodingResponse = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setSearchError(null);
  }, []);

  return {
    results,
    isSearching,
    searchError,
    searchLocations,
    clearResults,
  };
};

export const useCurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useState(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  });

  return time;
};
