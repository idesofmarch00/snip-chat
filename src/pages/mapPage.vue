<script setup lang="ts">
//dependencies
import { ref, onMounted, computed } from 'vue';
import mapboxMap from '../components/mapboxMap.vue';
// import * as turf from '@turf/turf';
//store,actions
import { useMapStore } from '../stores/mapStore';

const mapStore = useMapStore();
</script>

<template>
  <div class="relative overflow-hidden">
    <div class="relative h-[calc(100vh-5.5rem)]">
      <mapboxMap class="" />
    </div>
  </div>
</template>
