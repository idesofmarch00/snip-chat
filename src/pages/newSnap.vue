<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useChatStore } from '../stores/chatStore';
import { useUserStore } from 'src/stores/userStore';
import { useRouter } from 'vue-router';

import {
  getDownloadURL,
  ref as fireStorageRef,
  uploadBytesResumable,
} from 'firebase/storage';
import {
  doc,
  onSnapshot,
  collection,
  query,
  getDocs,
  orderBy,
  updateDoc,
  serverTimestamp,
  arrayRemove,
  arrayUnion,
Timestamp,
} from 'firebase/firestore';
import { db, getCurrentUser } from '../boot/firebase';
import { storage } from '../boot/firebase';
import { v4 as uuid } from 'uuid';

// import Camera from 'simple-vue-camera';

const chatStore = useChatStore();
const userStore = useUserStore();
const router = useRouter();

const downloadRef = ref();
async function goBack() {
  chatStore.setCurrentCamPic(null);
  chatStore.setCurrentCamPicURL(null);
  const docRef = doc(db, 'chats', userStore?.currentChatFriend[0]);


              await updateDoc(docRef, {
                messages: arrayUnion({
                  id: uuid(),
                  text: '',
                  senderId: userStore.user.uid,
                  date: Timestamp.now(),
                  snap: '',
                  file: '',
                  img: '',
                  snapMessage: `You received a snap from ${userStore.user.displayName}`,
                }),
              });

  await updateDoc(docRef, {
    messages: arrayRemove(chatStore?.currentSnapToDelete),
  });


  router.replace('/dashboard');
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

const countdown = ref();
const interval = ref<any>();

const countdownCircle = ref();
watch(countdown, (updatedCountdown) => {
  if (updatedCountdown < 8 && updatedCountdown > 5) {
    countdownCircle.value.style.stroke = 'yellow';
  } else if (updatedCountdown < 5 && updatedCountdown > 3) {
    countdownCircle.value.style.stroke = 'orange';
  } else if (updatedCountdown < 3 && updatedCountdown > 0) {
    countdownCircle.value.style.stroke = 'red';
  } else if (updatedCountdown == 0) {
    clearInterval(interval.value);
    router.replace('/dashboard');
  }
});

onMounted(() => {
  countdown.value = 10;
  interval.value = setInterval(function () {
    countdown.value = countdown.value - 1;
  }, 1000);
});
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
        class="absolute top-3 left-3 text-gray-400 text-md container-center justify-center"
      />
      <img
        v-show="chatStore.currentCamPicURL"
        :src="chatStore.currentCamPicURL"
        alt="totalizer"
        class="rounded-lg h-full w-full"
      />
      <q-icon
        name="download"
        @click="downloadImage"
        size="md"
        class="absolute bottom-3 left-4 text-md bg-transparent container-center justify-center text-gray-400"
      />
      <svg class="">
        <circle ref="countdownCircle" r="19" cx="20" cy="20"></circle>
      </svg>
    </div>
  </form>
  <a name="download" ref="downloadRef" download />

  <!-- <div class="row items-center justify-evenly h-[calc(100vh)]">
  <router-link to="/capture"><q-icon name="arrow_back" /></router-link>
  <img class="h-full w-full" :src="chatStore.currentCamPic">
  </div> -->
</template>

<style scoped>
svg {
  position: absolute;
  bottom: 0px;
  right: 65%;
  width: 55%;
  height: 55%;
  transform: rotateY(-180deg) rotateZ(-90deg);
}

svg circle {
  stroke-dasharray: 113px;
  stroke-dashoffset: 0px;
  stroke-linecap: round;
  stroke-width: 4px;
  stroke: white;
  fill: none;
  width: 100%;
  height: 100%;
  animation: countdown 10s linear infinite forwards;
}

@keyframes countdown {
  from {
    stroke-dashoffset: 0px;
  }
  to {
    stroke-dashoffset: 113px;
  }
}
</style>
