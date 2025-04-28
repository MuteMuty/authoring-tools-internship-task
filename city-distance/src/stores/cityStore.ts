import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFetch, useAsyncState } from '@vueuse/core';
import { config } from '@/config';
import type { City } from '@/types/city';
import type { LocationData, WeatherData, GeocodingResponse, WeatherResponse } from '@/types/location';
import { calculateDistance, calculateDistanceAI } from '@/utils/distance';

export const useCityStore = defineStore('city', () => {
  const cities = ref<City[]>([]);
  const selectedCity = ref<City | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getWeatherData = async (lat: number, lng: number): Promise<WeatherData | null> => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      appid: config.openWeather.apiKey,
      units: 'metric'
    });

    const { data, error } = await useFetch<WeatherResponse>(
      `${config.openWeather.baseUrl}${config.openWeather.endpoints.weather}?${params}`
    ).json();

    if (error.value || !data.value?.weather?.[0]) {
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

  const getLocationName = async (lat: number, lng: number): Promise<LocationData | null> => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      limit: '1',
      appid: config.openWeather.apiKey
    });

    const { data: locationData, error: locationError } = await useFetch<GeocodingResponse[]>(
      `${config.openWeather.baseUrl}${config.openWeather.endpoints.geocoding}?${params}`
    ).json();

    if (locationError.value || !locationData.value?.[0]) {
      console.error('Failed to fetch location name:', locationError.value);
      return null;
    }

    const location = locationData.value[0];
    
    const countryParams = new URLSearchParams({
      country: location.country
    });

    const { data: countryData, error: countryError } = await useFetch<City[]>(
      `${config.api.baseUrl}${config.api.endpoints.cities}?${countryParams}`
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

    const { data, error: fetchError } = await useFetch<City[]>(
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
        const weather = await getWeatherData(city.lat, city.lng);
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
    const [locationInfo, weatherData] = await Promise.all([
      getLocationName(lat, lng),
      getWeatherData(lat, lng)
    ]);

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