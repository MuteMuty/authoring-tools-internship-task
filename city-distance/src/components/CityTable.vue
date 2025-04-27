<template>
  <div class="city-table-container">
    <div v-if="loading" class="loading">Loading cities...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div class="table-wrapper" v-if="!loading && !error">
      <table class="city-table">
        <thead>
          <tr>
            <th>City Name</th>
          <th class="hide-on-mobile">Country</th>
          <th class="hide-on-mobile">Coordinates</th>
          <th>Distance (km)</th>
          <th class="hide-on-mobile">Distance AI (km)</th>
          <th class="hide-on-mobile">Weather</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="city in cities" 
          :key="city.name"
          :class="{ 'selected': city === selectedCity }"
          @click="selectCity(city)"
        >
          <td>{{ city.name }}</td>
          <td class="hide-on-mobile">{{ city.country_name }}</td>
          <td class="hide-on-mobile">
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

const store = useCityStore();
const { cities, selectedCity, loading, error } = storeToRefs(store);
const { selectCity } = store;
</script>

<style scoped>
.city-table-container {
  width: 100%;
  margin: 1rem 0;
}

.table-wrapper {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  max-height: 500px;
  overflow-y: auto;
}

.city-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
  color: var(--color-text);
}

.city-table th,
.city-table td {
  padding: 0.75rem;
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
}

.city-table tr.selected {
  background-color: var(--color-background-mute);
  color: var(--color-text);
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

@media (max-width: 600px) {
  .hide-on-mobile {
    display: none;
  }
  
  .city-table th,
  .city-table td {
    padding: 0.5rem;
  }
}
</style> 