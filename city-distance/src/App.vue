<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useGeolocation } from '@vueuse/core';
import { useCityStore } from '@/stores/cityStore';
import CityTable from './components/CityTable.vue';
import { storeToRefs } from 'pinia';

const store = useCityStore();
const { selectedCity } = storeToRefs(store);
const { setUserLocation } = store;

const { coords, error, isSupported } = useGeolocation();

watch(coords, async (newCoords, oldCoords) => {
  if (newCoords && (!oldCoords || 
      newCoords.latitude !== oldCoords.latitude || 
      newCoords.longitude !== oldCoords.longitude)) {
    await setUserLocation(newCoords.latitude, newCoords.longitude);
  }
});

watch(error, (newError) => {
  if (newError) {
    console.error('Error getting location:', newError);
    // fetch only random cities without the geolocation one
    store.fetchCities();
  }
});

onMounted(() => {
  if (!isSupported.value) {
    console.error('Geolocation is not supported by this browser.');
    // fetch only random cities without the geolocation one
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

<style scoped>
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
</style>
