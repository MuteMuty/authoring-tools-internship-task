<script setup lang="ts">
import { onMounted } from 'vue';
import { useCityStore } from '@/stores/cityStore';
import CityTable from './components/CityTable.vue';
import { storeToRefs } from 'pinia';

const store = useCityStore();
const { selectedCity } = storeToRefs(store);
const { setUserLocation } = store;

onMounted(async () => {
  // Try to get user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await setUserLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        store.fetchCities();
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    store.fetchCities();
  }
});
</script>

<template>
  <div class="app">
    <header>
      <h1>City Distance Calculator</h1>
      <p v-if="selectedCity">
        Selected City: {{ selectedCity.name }}, {{ selectedCity.country_name }}
      </p>
    </header>
    
    <main>
      <CityTable />
    </main>
  </div>
</template>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

@media (max-width: 600px) {
  .app {
    padding: 1rem;
  }
}
</style>
