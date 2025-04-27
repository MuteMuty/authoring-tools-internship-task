import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCityStore } from './cityStore';
import { storeToRefs } from 'pinia';
import type { City } from '@/types/city';

export const useFilterStore = defineStore('filter', () => {
  const cityStore = useCityStore();
  const { cities } = storeToRefs(cityStore);

  const filterType = ref<'none' | 'temp' | 'condition'>('none');
  const tempOperator = ref<'above' | 'below'>('above');
  const tempValue = ref(0);
  const selectedCondition = ref('');

  const uniqueConditions = computed(() => {
    const conditions = new Set<string>();
    cities.value.forEach((city: City) => {
      if (city.weather?.conditions) {
        conditions.add(city.weather.conditions);
      }
    });
    return Array.from(conditions).sort();
  });

  const filteredCities = computed(() => {
    if (filterType.value === 'none') {
      return cities.value;
    }

    return cities.value.filter((city: City) => {
      if (!city.weather) return false;

      if (filterType.value === 'temp') {
        const cityTemp = city.weather.temperature;
        return tempOperator.value === 'above' 
          ? cityTemp > tempValue.value 
          : cityTemp < tempValue.value;
      }

      if (filterType.value === 'condition') {
        if (!selectedCondition.value) return true;
        return city.weather.conditions === selectedCondition.value;
      }

      return true;
    });
  });

  const resetFilters = () => {
    tempValue.value = 0;
    selectedCondition.value = '';
  };

  return {
    filterType,
    tempOperator,
    tempValue,
    selectedCondition,
    uniqueConditions,
    filteredCities,
    resetFilters
  };
}); 