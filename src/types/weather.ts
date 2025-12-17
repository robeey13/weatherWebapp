export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current: CurrentWeather;
  current_units: CurrentUnits;
  hourly: HourlyWeather;
  hourly_units: HourlyUnits;
  daily: DailyWeather;
  daily_units: DailyUnits;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  uv_index: number;
  visibility: number;
  pressure_msl: number;
}

export interface CurrentUnits {
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  precipitation: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  uv_index: string;
  visibility: string;
  pressure_msl: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
}

export interface HourlyUnits {
  temperature_2m: string;
  weather_code: string;
  precipitation_probability: string;
  wind_speed_10m: string;
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}

export interface DailyUnits {
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
  precipitation_probability_max: string;
  wind_speed_10m_max: string;
  uv_index_max: string;
  sunrise: string;
  sunset: string;
}

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: Location[];
}

export interface WeatherInfo {
  description: string;
  icon: string;
  category: 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  showHourlyForecast: boolean;
}
