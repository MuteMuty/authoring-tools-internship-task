<template>
  <div class="city-table-container">
    <div v-if="loading" class="loading">Loading cities...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div class="filter-controls" v-if="!loading && !error">
      <div class="filter-group">
        <label for="filter-type">Filter by:</label>
        <select id="filter-type" v-model="filterType" @change="resetFilters">
          <option value="none">None</option>
          <option value="temp">Temperature</option>
          <option value="condition">Weather Condition</option>
        </select>
      </div>

      <div class="filter-group" v-if="filterType === 'temp'">
        <label for="temp-operator">Temperature:</label>
        <select id="temp-operator" v-model="tempOperator">
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <input 
          type="range" 
          v-model="tempValue" 
          :min="-20" 
          :max="40" 
          step="1"
          class="temp-slider"
        />
        <span class="temp-value">{{ tempValue }}°C</span>
      </div>

      <div class="filter-group" v-if="filterType === 'condition'">
        <label for="condition">Condition:</label>
        <select id="condition" v-model="selectedCondition">
          <option value="">Select condition</option>
          <option v-for="condition in uniqueConditions" :key="condition" :value="condition">
            {{ condition }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="table-wrapper" v-if="!loading && !error">
      <table class="city-table">
        <thead>
          <tr>
            <th>City Name</th>
            <th class="hide-medium">Country Name</th>
            <th class="hide-medium">Country Code</th>
            <th class="hide-medium">Coordinates</th>
            <th>Distance (km)</th>
            <th class="hide-on-mobile">Distance AI (km)</th>
            <th class="hide-on-mobile">Weather</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="city in filteredCities" 
            :key="city.name"
            :class="{ 'selected': city === selectedCity }"
            @click="selectCity(city)"
          >
            <td>{{ city.name }}</td>
            <td class="hide-medium">{{ city.country_name }}</td>
            <td class="hide-medium">{{ city.country }}</td>
            <td class="hide-medium">
              {{ city.lat.toFixed(2) }}, {{ city.lng.toFixed(2) }}
            </td>
            <td>{{ city.distance?.toFixed(2) || 'N/A' }}</td>
            <td class="hide-on-mobile">{{ city.distanceAI?.toFixed(2) || 'N/A' }}</td>
            <td class="hide-on-mobile">
              <div v-if="city.weather" class="weather-info">
                <img 
                  :src="`https://openweathermap.org/img/wn/${city.weather.icon}@2x.png`" 
                  :alt="city.weather.description"
                  class="weather-icon"
                />
                <div class="weather-details">
                  <div>{{ city.weather.temperature }}°C</div>
                  <div>{{ city.weather.description }}</div>
                </div>
              </div>
              <div v-else>-</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCityStore } from '@/stores/cityStore';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const store = useCityStore();
const { cities, selectedCity, loading, error } = storeToRefs(store);
const { selectCity } = store;

const filterType = ref<'none' | 'temp' | 'condition'>('none');
const tempOperator = ref<'above' | 'below'>('above');
const tempValue = ref(0);
const selectedCondition = ref('');

const uniqueConditions = computed(() => {
  const conditions = new Set<string>();
  cities.value.forEach(city => {
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

  return cities.value.filter(city => {
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
</script>

<style scoped>
.city-table-container {
  width: 100%;
  margin: 1rem 0;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  white-space: nowrap;
}

select {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
}

.temp-slider {
  width: 150px;
  margin: 0 0.5rem;
}

.temp-value {
  min-width: 3rem;
  text-align: center;
}

.table-wrapper {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  max-height: 500px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.city-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
  color: var(--color-text);
}

.city-table th,
.city-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.city-table th {
  background-color: var(--color-background-soft);
  font-weight: 600;
  color: var(--color-text);
  position: sticky;
  top: 0;
  z-index: 1;
}

.city-table tr:hover {
  background-color: var(--color-background-soft);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.city-table tr.selected {
  background-color: var(--color-primary);
  color: white;
}

.city-table tr.selected:hover {
  background-color: var(--color-primary-dark);
}

.loading,
.error {
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weather-icon {
  width: 40px;
  height: 40px;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (max-width: 900px) {
  .city-table th,
  .city-table td {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 760px) {
  .hide-medium {
    display: none;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .filter-group {
    flex-wrap: wrap;
  }
}

@media (max-width: 500px) {
  .hide-on-mobile {
    display: none;
  }
  
  .city-table th,
  .city-table td {
    font-size: 1rem;
  }
}
</style> 