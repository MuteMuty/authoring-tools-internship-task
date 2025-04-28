export interface LocationData {
  name: string;
  country: string;
  country_name: string;
}

export interface WeatherData {
  temperature: number;
  conditions: string;
  description: string;
  icon: string;
}

export interface GeocodingResponse {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherResponse {
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
} 