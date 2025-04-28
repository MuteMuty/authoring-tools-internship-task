import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCityStore } from './cityStore';
import { storeToRefs } from 'pinia';
import type { City } from '@/types/city';
import { WEATHER_CONDITIONS, TEMPERATURE_OPERATORS } from '@/constants/weather';

export const useFilterStore = defineStore('filter', () => {
  const cityStore = useCityStore();
  const { cities } = storeToRefs(cityStore);

  const filterType = ref<typeof WEATHER_CONDITIONS[keyof typeof WEATHER_CONDITIONS]>(WEATHER_CONDITIONS.NONE);
  const temperatureOperator = ref<typeof TEMPERATURE_OPERATORS[keyof typeof TEMPERATURE_OPERATORS]>(TEMPERATURE_OPERATORS.ABOVE);
  const temperatureValue = ref(0);
  const selectedCondition = ref('');

  const getUniqueConditions = (cities: City[]): string[] => {
    const conditions = cities
      .map(city => city.weather?.conditions)
      .filter((condition): condition is string => Boolean(condition));
    
    return [...new Set(conditions)].sort();
  };

  const uniqueConditions = computed(() => getUniqueConditions(cities.value));

  const filterByTemperature = (city: City): boolean => {
    if (!city.weather) return false;
    
    const { temperature } = city.weather;
    return temperatureOperator.value === TEMPERATURE_OPERATORS.ABOVE
      ? temperature > temperatureValue.value
      : temperature < temperatureValue.value;
  };

  const filterByCondition = (city: City): boolean => {
    if (!city.weather) return false;
    
    const { conditions } = city.weather;
    return !selectedCondition.value || conditions === selectedCondition.value;
  };

  const filteredCities = computed(() => {
    if (filterType.value === WEATHER_CONDITIONS.NONE) return cities.value;

    return cities.value.filter(city => {
      switch (filterType.value) {
        case WEATHER_CONDITIONS.TEMPERATURE:
          return filterByTemperature(city);
        case WEATHER_CONDITIONS.CONDITION:
          return filterByCondition(city);
        default:
          return true;
      }
    });
  });

  const resetFilters = () => {
    temperatureValue.value = 0;
    selectedCondition.value = '';
  };

  return {
    filterType,
    temperatureOperator,
    temperatureValue,
    selectedCondition,
    uniqueConditions,
    filteredCities,
    resetFilters
  };
}); 