import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, computed } from 'vue';
import { config } from '@/config';

interface City {
  name: string;
  country: string;
  country_name: string;
  altnames?: string;
  lat: number;
  lng: number;
  distance?: number;
  weather?: {
    temperature: number;
    conditions: string;
    description: string;
    icon: string;
  };
}

export const useCityStore = defineStore('city', () => {
  const cities = ref<City[]>([]);
  const selectedCity = ref<City | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Haversine formula for distance calculation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getWeatherData = async (city: City) => {
    try {
      const response = await axios.get(
        `${config.openWeather.baseUrl}${config.openWeather.endpoints.weather}?lat=${city.lat}&lon=${city.lng}&appid=${config.openWeather.apiKey}&units=metric`
      );
      
      return {
        temperature: response.data.main.temp,
        conditions: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      };
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      return null;
    }
  };

  const getLocationName = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `${config.openWeather.baseUrl}${config.openWeather.endpoints.geocoding}?lat=${lat}&lon=${lng}&limit=1&appid=${config.openWeather.apiKey}`
      );
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return {
          name: location.name,
          country: location.country,
          country_name: location.country
        };
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch location name:', err);
      return null;
    }
  };

  const fetchCities = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${config.api.baseUrl}${config.api.endpoints.randomCities}`);
      const citiesWithWeather = await Promise.all(
        response.data.map(async (city: City) => {
          const weather = await getWeatherData(city);
          return { ...city, weather };
        })
      );
      cities.value = citiesWithWeather;
      if (selectedCity.value) {
        updateDistances(selectedCity.value);
      }
    } catch (err) {
      error.value = 'Failed to fetch cities';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const updateDistances = (originCity: City) => {
    cities.value = cities.value.map(city => ({
      ...city,
      distance: calculateDistance(
        originCity.lat,
        originCity.lng,
        city.lat,
        city.lng
      )
    }));
  };

  const selectCity = (city: City) => {
    selectedCity.value = city;
    updateDistances(city);
  };

  const setUserLocation = async (lat: number, lng: number) => {
    const locationInfo = await getLocationName(lat, lng);
    const userLocation = {
      name: locationInfo?.name || 'Your Location',
      country: locationInfo?.country || 'CURRENT',
      country_name: locationInfo?.country_name || 'Current Location',
      lat,
      lng
    };
    selectCity(userLocation);
    await fetchCities();
  };

  return {
    cities,
    selectedCity,
    loading,
    error,
    fetchCities,
    selectCity,
    setUserLocation
  };
}); 