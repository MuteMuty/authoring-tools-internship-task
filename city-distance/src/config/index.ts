export const config = {
  openWeather: {
    apiKey: '1001b63d6c6552aa1cbb5cb72841ec0a',
    baseUrl: 'https://api.openweathermap.org',
    endpoints: {
      weather: '/data/2.5/weather',
      geocoding: '/geo/1.0/reverse'
    }
  },
  api: {
    baseUrl: 'http://localhost:3000',
    endpoints: {
      cities: '/api/cities',
      randomCities: '/api/random-cities'
    }
  }
}; 