<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useChatStore } from '../stores/chatStore';
import { useRouter } from 'vue-router';

// import Camera from 'simple-vue-camera';

const chatStore = useChatStore();
const router = useRouter();

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
    video: {
        "width": 640,
        "height": 480
    },
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

  const context = canvas.value.getContext('2d').drawImage(0, 0, 160, 120);
  const photoFromVideo = camera.value;
  console.log("1",photoFromVideo,"2",context)
  router.replace('/preview');
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
  <div class="row items-center justify-evenly h-[calc(100vh)] bg-black">
    <div class="">
      <video class="camera-video" ref="camera" autoplay playsinline></video>
      <canvas v-show="isPhotoTaken" ref="canvas" width="160" height="120"></canvas>
    </div>

    <q-btn icon="camera" round @click="takePhoto" class="text-white text-lg" />

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
  </div>
</template>

<style scoped>
.camera-video {
  height: 100%;
  width: 100%;
}
</style>
