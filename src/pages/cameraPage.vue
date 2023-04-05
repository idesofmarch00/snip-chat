<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useChatStore } from '../stores/chatStore';

// import Camera from 'simple-vue-camera';

const chatStore = useChatStore();

const pic = ref();

watch(chatStore, (updatedChatStore) => {
  console.log(updatedChatStore.currentCamPic);
});

const isPhotoTaken = ref(false);

const camera = ref();
const canvas = ref();
const downloadPhoto = ref();
const constraints = ref();

function createCameraElement() {
   constraints.value = {
    audio: false,
    video: true,
  };

  navigator.mediaDevices
    .getUserMedia(constraints.value)
    .then((stream) => {
      camera.value.srcObject = stream;
    })
    .catch((error) => {
      console.log(error);
      alert('May the browser didnt support or there is some errors.');
    });
}
function stopCameraStream() {
  if (camera.value.srcObject) {
    const tracks = camera.value.srcObject.getTracks();
    if (tracks.length > 0) {
      tracks.forEach((track: any) => {
        track.stop();
      });
    }
  }
}

function takePhoto() {
  isPhotoTaken.value = !isPhotoTaken.value;

  const context = canvas.value.getContext('2d');
  const photoFromVideo = camera.value;

  context.drawImage(photoFromVideo, 0, 0, 1920, 1080, 0, 0, 1920, 1080);

  stopCameraStream();
}

function downloadImage() {
  const download = downloadPhoto.value;
  const downloadPic = canvas.value
    .toDataURL('image/jpeg')
    .replace('image/jpeg', 'image/octet-stream');
  download.setAttribute('href', downloadPic);
}

onMounted(() => {
  createCameraElement();
});

onBeforeUnmount(() => {
  stopCameraStream();
});
</script>

<template>
  <q-page
    class="row items-center justify-evenly relative h-[calc(100vh-8rem)] bg-blue-50"
  >
    <div class="">
      <video
        class="camera-video"
        ref="camera"
        autoplay
        playsinline
      ></video>
      <canvas
        v-show="isPhotoTaken"
        ref="canvas"
      ></canvas>
    </div>

    <q-btn icon="camera" round @click="takePhoto" />

    <button v-if="isPhotoTaken">
      <a
        ref="downloadPhoto"
        download="snap.jpg"
        class="button"
        role="button"
        @click="downloadImage"
      >
        <q-btn icon="download" round />
      </a>
    </button>
  </q-page>
</template>

<style scoped>
.camera-video{
  height:max-content;
  width:max-content;
}
</style>
