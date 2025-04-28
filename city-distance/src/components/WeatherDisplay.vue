<template>
  <div v-if="weather" class="weather-info">
    <img 
      :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`" 
      :alt="weather.description"
      class="weather-icon"
    />
    <div class="weather-details">
      <div>{{ weather.temperature }}°C</div>
      <div>{{ weather.description }}</div>
    </div>
  </div>
  <div v-else>-</div>
</template>

<script setup lang="ts">
import type { WeatherData } from '@/types/location';

defineProps<{
  weather?: WeatherData;
}>();
</script>

<style lang="scss" scoped>
.weather-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .weather-icon {
    width: 40px;
    height: 40px;
  }

  .weather-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style> 