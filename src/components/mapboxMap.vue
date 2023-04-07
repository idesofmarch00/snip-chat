<script setup lang="ts" async>
//dependencies
import { onMounted, ref, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '../boot/firebase';

//store,actions
import { useMapStore } from '../stores/mapStore';
import { useUserStore } from '../stores/userStore';

//imports
import { getLocation } from '../utils/map';
// import { evData } from '../../data/data';

const mapStore = useMapStore();
const userStore = useUserStore();

const defaultCoords = ref({
  lat: 28.509379,
  lng: 77.08394,
});
const coords = ref<any>();
const markers = ref<any>();

const allUsersArray: Array<any> = [];

async function fetchAllUsers() {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    allUsersArray.push(doc.data());
    userStore.setAllUsers(allUsersArray);
  });
}

onMounted(async () => {
  await fetchAllUsers();

  mapboxgl.accessToken =
    'pk.eyJ1IjoidXNhaWYxMzExIiwiYSI6ImNsZDdoc3J6NDBlenkzcXBiOTEzZml1cDcifQ.vj73_blmjljI0sUEHAwOcw';

  navigator.permissions
    .query({ name: 'geolocation' })
    .then(async function (PermissionStatus) {
      if (PermissionStatus.state == 'granted') {
        //allowed
        userStore.toggleLocationPopup(false);
        coords.value = await getLocation();
        defaultCoords.value = coords.value;
      } else {
        //denied
        userStore.toggleLocationPopup(true);
      }
    });

  mapStore.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    zoom: 13,
    center: [defaultCoords.value.lng, defaultCoords.value.lat],
  });

  mapStore.map.on('load', () => {
    mapStore.maploader = false;
  });

  // Create a default Marker and add it to the map.
  // const myMarker = new mapboxgl.Marker()
  //   .setLngLat([defaultCoords.value.lng, defaultCoords.value.lat])
  //   .addTo(mapStore.map);

  // Add zoom and rotation controls to the map.
  mapStore.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

  // mapStore.map.addControl(new mapboxgl.FullscreenControl());

  // Add the geocoder control to the map.
  mapStore.map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    })
  );

  // Add the userlocation geolocation control to the map.
  mapStore.map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    }),
    'bottom-right'
  );

  mapStore.setUsersMarkers(userStore.allUsers);
  mapStore.usersMarkers.forEach((marker: any) => {
    const el = document.createElement('div');
    el.className = 'marker ';
    el.style.backgroundImage = `url('${marker.photoURL}.png')`;
    el.style.objectFit = 'contain';
    el.style.width = '80px';
    el.style.height = '80px';
    el.style.borderRadius = "40px";
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(` <div class="btn-slot text-zinc-600 max w-40 flex flex-col space-y-2">
    <div class="w-full flex items-center justify-between">
      <p class="font-bold text-lg w-8/12 truncate">
        ${marker.displayName}
      </p>
    </div>
    <div class="text-[0.65rem] font-medium flex flex-col space-y-1">
      <p class="m-0 leading-3">${marker.email}</p>
      <p class="m-0 leading-3">Online : <span class="text-green font-bold">${marker.online}</span></p>
    </div>
    <div class="w-full mt-3 flex items-center justify-between">
      <div class="flex items-center gap-x-4">
      </div>

     
    </div>
  </div>
`);

 // <button  class="text-blue-500 font-bold text-xs">
      //   <a href="https://www.google.com/maps/dir/?api=1&dir_action=navigate&travelmode=driving&destination=${defaultCoords.value?.lat},${defaultCoords.value?.lng}&origin=${marker?.location?.lat},${marker?.location?.lng}" target="
      //     _blank">
      //       Navigate
      //       </a>
      // </button>

    markers.value = new mapboxgl.Marker(el)
      .setLngLat([Number(marker?.location.lng), Number(marker?.location.lat)])
      .setPopup(popup)
      .addTo(mapStore.map);

  //     function reply_click(clicked_id)
  // {
  //     alert(clicked_id);
  // }

  });
});

// watch(
//   () => mapStore.filterMarkers,
//   () => {
//     console.log(mapStore.filterMarkers);

//     Object.keys(markers.value).forEach(function (marker: any) {
//       console.log(marker.value);
//       marker.value.remove();
//     });

//     mapStore.filterMarkers.forEach((marker: any, index: any) => {
//       const el = document.createElement('div');
//       el.className = `marker marker-${index}`;
//       el.style.backgroundImage = `url('src/assets/${marker.type}.png')`;
//       el.style.width = '20px';
//       el.style.height = '27px';
//     const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<div class=''>
//           <div>
//             <div class='m-2 font-normal'><span class='font-bold'>Name</span>
//               ${marker?.displayName}
//             </div>
//             </div>
//           </div>`);
//       new mapboxgl.Marker(el)
//         .setLngLat([Number(marker?.lng), Number(marker?.lat)])
//         .setPopup(popup)
//         .addTo(mapStore.map!);
//     });
//   }
// );

// const handleSelect = async (e) => {
//   console.log('friend is',e)
//   //check whether the group(chats in firestore) exists, if not create
//   const combinedId =
//     userStore.user.uid > friend.value.uid
//       ? userStore.user.uid + friend.value.uid
//       : friend.value.uid + userStore.user.uid;
//   try {
//     const res = await getDoc(doc(db, 'chats', combinedId));

//     if (!res.exists()) {
//       //create a chat in chats collection
//       await setDoc(doc(db, 'chats', combinedId), { messages: [] });
//       //create friend chats
//       await updateDoc(doc(db, 'userChats', userStore.user.uid), {
//         [combinedId + '.friendInfo']: {
//           uid: friend.value.uid,
//           displayName: friend.value.displayName,
//           photoURL: friend.value.photoURL,
//           online:true,
//         },
//         [combinedId + '.date']: serverTimestamp(),
//       });
//       await updateDoc(doc(db, 'userChats', friend.value.uid), {
//         [combinedId + '.friendInfo']: {
//           uid: userStore.user.uid,
//           displayName: userStore.user.displayName,
//           photoURL: userStore.user.photoURL,
//           online:true,
//         },
//         [combinedId + '.date']: serverTimestamp(),
//       });

//       $toast('Friend added successfully', 'success', 'top');
//     }
//     else{
//       alert('User is already a friend.')
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };


</script>

<template>
  <div id="map" class="h-full"></div>
</template>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.marker {
  display: block;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
}
</style>
