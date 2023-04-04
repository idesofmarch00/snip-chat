import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMapStore = defineStore('mapStore', () => {
  //state
  const map = ref<any>();
  const maploader = ref<boolean>(true);
  const formattedAddress = ref<string>('');
  const usersMarkers = ref<any[]>([]);

  

  //actions
  const toggleMaploader = (map: boolean) => {
    maploader.value = map;
  };

  function setUsersMarkers(markers:any){
    usersMarkers.value=markers
  };

  return {
    map,
    maploader,
    formattedAddress,
    usersMarkers,
    setUsersMarkers,
    toggleMaploader,
  };
});
