import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFetch, useAsyncState } from '@vueuse/core';
import { config } from '@/config';

interface City {
  name: string;
  country: string;
  country_name: string;
  altnames?: string;
  lat: number;
  lng: number;
  distance?: number;
  distanceAI?: number;
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
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
  
    const dlat1 = lat1 * Math.PI / 180;
    const dlat2 = lat2 * Math.PI / 180;
    const avg_dlat = (lat2 - lat1) * Math.PI / 180;
    const avg_dlon = (lon2 - lon1) * Math.PI / 180;
  
    const a = Math.sin(avg_dlat / 2) * Math.sin(avg_dlat / 2) +
              Math.cos(dlat1) * Math.cos(dlat2) *
              (Math.sin(avg_dlon / 2) * Math.sin(avg_dlon / 2));
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
  };

  // AI-generated Haversine formula for distance calculation
  const calculateDistanceAI = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
  
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  };

  const getWeatherData = async (city: City) => {
    const { data, error } = await useFetch(
      `${config.openWeather.baseUrl}${config.openWeather.endpoints.weather}?lat=${city.lat}&lon=${city.lng}&appid=${config.openWeather.apiKey}&units=metric`
    ).json();

    if (error.value) {
      console.error('Failed to fetch weather data:', error.value);
      return null;
    }

    return {
      temperature: data.value.main.temp,
      conditions: data.value.weather[0].main,
      description: data.value.weather[0].description,
      icon: data.value.weather[0].icon
    };
  };

  const getLocationName = async (lat: number, lng: number) => {
    const { data: locationData, error: locationError } = await useFetch(
      `${config.openWeather.baseUrl}${config.openWeather.endpoints.geocoding}?lat=${lat}&lon=${lng}&limit=1&appid=${config.openWeather.apiKey}`
    ).json();

    if (locationError.value || !locationData.value?.[0]) {
      console.error('Failed to fetch location name:', locationError.value);
      return null;
    }

    const location = locationData.value[0];
    
    const { data: countryData, error: countryError } = await useFetch(
      `${config.api.baseUrl}${config.api.endpoints.cities}?country=${location.country}`
    ).json();

    if (countryError.value) {
      console.error('Failed to fetch country name:', countryError.value);
      return null;
    }

    const countryName = countryData.value?.[0]?.country_name || location.country;
    
    return {
      name: location.name,
      country: location.country,
      country_name: countryName
    };
  };

  const fetchCities = async () => {
    loading.value = true;
    error.value = null;

    const { data, error: fetchError } = await useFetch(
      `${config.api.baseUrl}${config.api.endpoints.randomCities}`
    ).json();

    if (fetchError.value) {
      error.value = 'Failed to fetch cities';
      console.error(fetchError.value);
      loading.value = false;
      return;
    }

    const citiesWithWeather = await Promise.all(
      data.value.map(async (city: City) => {
        const weather = await getWeatherData(city);
        return { ...city, weather };
      })
    );
    
    if (selectedCity.value) {
      cities.value = [selectedCity.value, ...citiesWithWeather];
    } else {
      cities.value = citiesWithWeather;
    }
    
    if (selectedCity.value) {
      updateDistances(selectedCity.value);
    }

    loading.value = false;
  };

  const updateDistances = (originCity: City) => {
    cities.value = cities.value.map(city => ({
      ...city,
      distance: calculateDistance(
        originCity.lat,
        originCity.lng,
        city.lat,
        city.lng
      ),
      distanceAI: calculateDistanceAI(
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
    const weatherData = await getWeatherData({ lat, lng } as City);
    const location: City = {
      name: locationInfo?.name || 'Your Location',
      country: locationInfo?.country || 'CURRENT',
      country_name: locationInfo?.country_name || 'Current Location',
      lat,
      lng,
      weather: weatherData ? {
        temperature: Number(weatherData.temperature),
        conditions: String(weatherData.conditions),
        description: String(weatherData.description),
        icon: String(weatherData.icon)
      } : undefined,
      distance: 0,
      distanceAI: 0
    };
    selectCity(location);
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