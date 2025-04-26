export const config = {
  openWeather: {
    apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
    baseUrl: 'https://api.openweathermap.org',
    endpoints: {
      weather: '/data/2.5/weather',
      geocoding: '/geo/1.0/reverse'
    }
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    endpoints: {
      cities: '/api/cities',
      randomCities: '/api/random-cities'
    }
  }
}; 