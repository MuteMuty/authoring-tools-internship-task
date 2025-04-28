<template>
  <div class="filter-controls">
    <div class="filter-group">
      <label for="filter-type">Filter by:</label>
      <select id="filter-type" v-model="filterStore.filterType" @change="filterStore.resetFilters">
        <option :value="WEATHER_CONDITIONS.NONE">None</option>
        <option :value="WEATHER_CONDITIONS.TEMPERATURE">Temperature</option>
        <option :value="WEATHER_CONDITIONS.CONDITION">Weather Condition</option>
      </select>
    </div>

    <div class="filter-group" v-if="filterStore.filterType === WEATHER_CONDITIONS.TEMPERATURE">
      <label for="temp-operator">Temperature:</label>
      <select id="temp-operator" v-model="filterStore.temperatureOperator">
        <option :value="TEMPERATURE_OPERATORS.ABOVE">Above</option>
        <option :value="TEMPERATURE_OPERATORS.BELOW">Below</option>
      </select>
      <input 
        type="range" 
        v-model="filterStore.temperatureValue" 
        :min="TEMPERATURE.MIN" 
        :max="TEMPERATURE.MAX" 
        :step="TEMPERATURE.STEP"
        class="temp-slider"
      />
      <span class="temp-value">{{ filterStore.temperatureValue }}{{ TEMPERATURE.UNIT }}</span>
    </div>

    <div class="filter-group" v-if="filterStore.filterType === WEATHER_CONDITIONS.CONDITION">
      <label for="condition">Condition:</label>
      <select id="condition" v-model="filterStore.selectedCondition">
        <option value="">Select condition</option>
        <option v-for="condition in filterStore.uniqueConditions" :key="condition" :value="condition">
          {{ condition }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from '@/stores/filterStore';
import { TEMPERATURE, WEATHER_CONDITIONS, TEMPERATURE_OPERATORS } from '@/constants/weather';

const filterStore = useFilterStore();
</script>

<style lang="scss" scoped>
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;

  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
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
  }
}

@media (max-width: 760px) {
  .filter-controls {
    flex-direction: column;
    
    .filter-group {
      flex-wrap: wrap;
    }
  }
}
</style> 