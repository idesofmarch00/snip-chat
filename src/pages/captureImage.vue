<template>
  <WebCamUI v-if="!image" ref="webcam" :fullscreenState="true" @photoTaken="photoTaken"/>
  <img v-if="image" :src="data.image_data_url" alt="">
</template>

<script setup>
import { WebCamUI } from 'vue-camera-lib';
import {ref} from 'vue';

const image = ref(null);
function photoTaken(data) {
  image.value=data.image_data_url;
  console.log('image blob: ', data.blob);
  console.log('image data url', data.image_data_url);
}
</script>
