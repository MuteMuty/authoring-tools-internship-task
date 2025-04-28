<template>
  <div class="city-table-container">
    <div v-if="loading" class="loading">Loading cities...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <CityFilters v-if="!loading && !error" />
    
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
            v-for="(city, index) in filterStore.filteredCities" 
            :key="index"
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
              <WeatherDisplay :weather="city.weather" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCityStore } from '@/stores/cityStore';
import { useFilterStore } from '@/stores/filterStore';
import { storeToRefs } from 'pinia';
import CityFilters from './CityFilters.vue';
import WeatherDisplay from './WeatherDisplay.vue';

const cityStore = useCityStore();
const { selectedCity, loading, error } = storeToRefs(cityStore);
const { selectCity } = cityStore;

const filterStore = useFilterStore();
</script>

<style lang="scss" scoped>
.city-table-container {
  width: 100%;
  margin: 1rem 0;

  .table-wrapper {
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    max-height: 500px;
    overflow-y: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: var(--color-background);

    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--color-background-soft);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 4px;
      transition: background-color 0.2s ease;

      &:hover {
        background: var(--color-primary);
      }
    }

    .city-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 0 auto;
      color: var(--color-text);
      font-size: 0.875rem;

      th, td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
        transition: background-color 0.2s ease;
      }

      th {
        background-color: var(--color-background-soft);
        font-weight: 600;
        color: var(--color-text);
        position: sticky;
        top: 0;
        z-index: 1;
        white-space: nowrap;
        border-bottom: 2px solid var(--color-border);
      }

      tr {
        &:hover {
          background-color: var(--color-background-soft);
          cursor: pointer;
        }

        &.selected {
          background-color: var(--color-primary);
          color: white;

          &:hover {
            background-color: var(--color-primary-dark);
          }
        }

        &:last-child td {
          border-bottom: none;
        }
      }

      td {
        &:first-child {
          border-left: 1px solid var(--color-border);
        }

        &:last-child {
          border-right: 1px solid var(--color-border);
        }
      }
    }
  }

  .loading, .error {
    text-align: center;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
  }

  .loading {
    background-color: var(--color-background-soft);
    color: var(--color-text);
  }

  .error {
    color: #d32f2f;
    background-color: #ffebee;
  }
}

// Media queries
@media (max-width: 900px) {
  .city-table {
    th, td {
      padding: 0.5rem;
      font-size: 0.875rem;
    }
  }
}

@media (max-width: 990px) {
  .hide-medium {
    display: none;
  }
}

@media (max-width: 640px) {
  .hide-on-mobile {
    display: none;
  }
  
  .city-table {
    th, td {
      font-size: 0.875rem;
    }
  }
}
</style>