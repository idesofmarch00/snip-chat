<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useChatStore } from '../stores/chatStore';
import { useRouter } from 'vue-router';

import {
  getDownloadURL,
  ref as fireStorageRef,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '../boot/firebase';
import { v4 as uuid } from 'uuid';

// import Camera from 'simple-vue-camera';

const chatStore = useChatStore();
const router = useRouter();

const downloadRef = ref();
function goBack() {
  chatStore.setCurrentCamPic(null);
  chatStore.setCurrentCamPicURL(null);
  router.replace('/dashboard');
}

function sendSnap() {
  console.log('snap');
}

function downloadImage() {
  // const storageRef = fireStorageRef(storage, `${uuid()}.jpg`);

  // const uploadTask = uploadBytesResumable(
  //   storageRef,
  //   chatStore.currentCamPicURL
  // );

  // uploadTask.on(
  //   (error) => {
  //     //TODO:Handle Error
  //   },
  //   async () => {
  //     await getDownloadURL(uploadTask.snapshot.ref).then(
  //       async (downloadURL) => {
  //         // Or inserted into an <img> element

  //         // downloadRef.value.setAttribute('src', downloadURL);
  //         // downloadRef.value.click();

  //         downloadRef.value.setAttribute('href', chatStore.currentCamPic);
  //         downloadRef.value.click();
  //       }
  //     );
  //   }
  // );

  downloadRef.value.setAttribute('href', chatStore.currentCamPic);
          downloadRef.value.click();
}
</script>

<template>
  <form
    class="w-full flex flex-col h-[calc(100vh)] space-y-1 items-center justify-center"
    @submit.prevent=""
  >
    <div
      class="h-full w-full bg-white rounded-lg relative flex flex-col items-center"
    >
      <!-- <Spinner
            :size="'spinner-lg'"
            :color="'green-spin'"
            v-if="loading"
            class="absolute top-36 left-40"
          /> -->
      <q-icon
        name="close"
        size="md"
        @click="goBack"
        class="absolute top-3 left-3  text-white text-md  container-center justify-center"
      />
      <img
        v-show="chatStore?.currentCamPicURL"
        :src="chatStore?.currentCamPic"
        alt="totalizer"
        class="rounded-lg h-full w-full"
      />
      <q-btn
        icon="arrow_forward"
        @click="sendSnap"
        class="absolute w-10 h-10 bottom-3 right-3 shadow-md text-white text-md border rounded-full container-center justify-center bg-blue-600"
      />
      <q-icon
        name="download"
        @click="downloadImage"
        size="md"
        class="absolute bottom-3 left-4  text-md bg-transparent container-center justify-center text-white"
      />
    </div>
  </form>
  <a name="download" ref="downloadRef" download />

  <!-- <div class="row items-center justify-evenly h-[calc(100vh)]">
  <router-link to="/capture"><q-icon name="arrow_back" /></router-link>
  <img class="h-full w-full" :src="chatStore.currentCamPic">
  </div> -->
</template>

<style scoped></style>
