<script setup lang='ts' async>
//dependencies
import { onMounted, ref, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

//store,actions
import { useMapStore } from '../stores/mapStore';

//imports
import { getLocation } from '../utils/map';
// import { evData } from '../../data/data';

const mapStore = useMapStore();

const defaultCoords = ref({
  lat: 28.509379,
  lng: 77.08394,
});
const coords = ref<any>();
const markers = ref<any>();
onMounted(async () => {
  mapboxgl.accessToken =
    import.meta.env.MAPBOX_ACCESS_TOKEN;
  coords.value = await getLocation();
  defaultCoords.value = coords.value;
  mapStore.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    zoom: 12,
    center: [defaultCoords.value.lng, defaultCoords.value.lat],
  });
  mapStore.map.on('load', () => {
    mapStore.maploader = false;
  });
  // mapStore.filterMarkers = evData;
  mapStore.filterMarkers.forEach((marker: any, index: any) => {
    const el = document.createElement('div');
    el.className = `marker marker-${index}`;
    el.style.backgroundImage = `url('src/assets/${marker.type}.png')`;
    el.style.width = '20px';
    el.style.height = '27px';
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<div class=''>
          <div>
            <div class='m-2 font-normal'><span class='font-bold'>Name</span>

              ${marker?.name}
              <br>
            </div>
            <div class='m-2 font-normal'><span class='font-bold'>Address:  </span>
              ${marker?.address}
              <br>
            </div>
            <div class='m-2 font-normal'><span class='font-bold'>Company:  </span>

                 ${marker?.type}
              <br>
            </div>
            <div href='https://www.google.com/maps/dir/?api=1&destination=238%20Bedford%20Ave%2C%20Brooklyn%2C%20NY%2C%2011249%2C%20United%20States' class='m-2 link text-blue-500'>Get Direction<br></div>
            </div>
          </div>
        </div>`);
    markers.value = new mapboxgl.Marker(el)
      .setLngLat([Number(marker?.longitude), Number(marker?.lattitude)])
      .setPopup(popup)
      .addTo(mapStore.map!);
      console.log(markers.value);
  });
});
watch(
  () => mapStore.filterMarkers,
  () => {
    console.log(mapStore.filterMarkers);

    Object.keys(markers.value).forEach(function (marker: any) {
      console.log(marker.value);
      marker.value.remove();
    });

    mapStore.filterMarkers.forEach((marker: any, index: any) => {
      const el = document.createElement('div');
      el.className = `marker marker-${index}`;
      el.style.backgroundImage = `url('src/assets/${marker.type}.png')`;
      el.style.width = '20px';
      el.style.height = '27px';
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<div class=''>
          <div>
            <div class='m-2 font-normal'><span class='font-bold'>Name</span>

              ${marker?.name}
              <br>
            </div>
            <div class='m-2 font-normal'><span class='font-bold'>Address:  </span>
              ${marker?.address}
              <br>
            </div>
            <div class='m-2 font-normal'><span class='font-bold'>Company:  </span>

                 ${marker?.type}
              <br>
            </div>
            <div href='https://www.google.com/maps/dir/?api=1&destination=238%20Bedford%20Ave%2C%20Brooklyn%2C%20NY%2C%2011249%2C%20United%20States' class='m-2 link text-blue-500'>Get Direction<br></div>
            </div>
          </div>
        </div>`);
      new mapboxgl.Marker(el)
        .setLngLat([Number(marker?.longitude), Number(marker?.lattitude)])
        .setPopup(popup)
        .addTo(mapStore.map!);
    });
  }
);
</script>

<template>
  <div id='map' class='h-full'></div>
</template>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.marker.marker-1 {
  background-image: url('../../assets/fb.png');
  background-size: cover;
}
</style>
