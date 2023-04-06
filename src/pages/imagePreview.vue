<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useChatStore } from '../stores/chatStore';
import { useRouter } from 'vue-router';

import {
  doc,
  onSnapshot,
  collection,
  query,
  getDocs,
  orderBy,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, getCurrentUser } from '../boot/firebase';
import { useUserStore } from '../stores/userStore';
import _ from 'lodash';
import { date as qDate } from 'quasar';

import * as timeago from 'timeago.js';
import {
  getDownloadURL,
  ref as fireStorageRef,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '../boot/firebase';
import { v4 as uuid } from 'uuid';

// import Camera from 'simple-vue-camera';

const chatStore = useChatStore();

const downloadRef = ref();
function goBack() {
  chatStore.setCurrentCamPic(null);
  chatStore.setCurrentCamPicURL(null);
  router.replace('/dashboard');
}

const dialog = ref(false);
const maximizedToggle = ref(false);

async function sendSnap() {
  await getUsersToSend();
  dialog.value = true;
  maximizedToggle.value = true;
}

async function getUsersToSend() {
  return;
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

const userStore = useUserStore();
let allChats: any = [];
const sortedChats = ref();

const router = useRouter();

onMounted(async () => {
  loading.value = true;

  const user = await getCurrentUser();
  if (user) {
    try {
      await onSnapshot(doc(db, 'userChats', userStore.user.uid), (doc: any) => {
        allChats = doc.data();
        userStore.setUserChats(doc.data());
        Sort();
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    router.replace('/login');
  }
});

const loading = ref<boolean>(false);
const today = new Date();

function Sort() {
  sortedChats.value = Object.entries(allChats)?.sort(
    (a: any, b: any) =>
      new Date(b[1]?.date?.toDate().toISOString()).getTime() -
      new Date(a[1]?.date?.toDate().toISOString()).getTime()
  );
  loading.value = false;
}

let selectedArray: any = [];
function addToSend(friend: any) {
  if (selectedArray.includes(friend[0])) {
    selectedArray.splice(selectedArray.indexOf(friend[0]), 1);
  } else {
    selectedArray.push(friend[0]);
  }
}

function sendNewSnap() {
  try {
    selectedArray.forEach((chatId: any) => {
      const storageRef = fireStorageRef(storage, `${uuid()}.jpg`);

      const uploadTask = uploadBytesResumable(
        storageRef,
        chatStore.currentCamPicURL
      );

      uploadTask.on(
        (error: any) => {
          //TODO:Handle Error
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(doc(db, 'userChats', userStore.user.uid), {
                [chatId + '.lastMessage']: {
                  snap: downloadURL,
                },
                [chatId + '.date']: serverTimestamp(),
              });

              await updateDoc(
                doc(db, 'userChats', chatId.replace(userStore.user.uid, '')),
                {
                  [chatId + '.lastMessage']: {
                    snap: downloadURL,
                  },
                  [chatId + '.date']: serverTimestamp(),
                }
              );
            }
          );
        }
      );
    });
    router.replace('/dashboard');
  } catch (err) {
    console.log('error sending snap');
  }
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
        class="absolute top-3 left-3 text-gray-400 text-md container-center justify-center"
      />
      <img
        v-show="chatStore?.currentCamPicURL"
        :src="chatStore?.currentCamPic"
        alt="totalizer"
        class="rounded-lg h-full w-full"
      />
      <q-btn
        label="Send"
        @click="sendSnap"
        class="absolute bottom-3 right-3 shadow-md text-white text-md border container-center justify-center bg-blue-600"
        ><q-icon name="send" color="white" class="ml-2" size="sm"
      /></q-btn>
      <q-icon
        name="download"
        @click="downloadImage"
        size="md"
        class="absolute bottom-3 left-4 text-md bg-transparent container-center justify-center text-gray-400"
      />
    </div>
  </form>
  <a name="download" ref="downloadRef" download />

  <!-- <div class="row items-center justify-evenly h-[calc(100vh)]">
  <router-link to="/capture"><q-icon name="arrow_back" /></router-link>
  <img class="h-full w-full" :src="chatStore.currentCamPic">
  </div> -->
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-primary text-white">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <div class="flex flex-col items-center justify-evenly">
        <div
          v-if="userStore.userChats && !loading"
          class="my-2 flex flex-col items-center space-y-3 w-11/12 overflow-auto"
        >
          <q-item
            @click.prevent="addToSend(chat)"
            clickable
            v-ripple
            v-for="chat in sortedChats"
            :key="chat[0]"
            class="bg-gray-50 w-full"
          >
            <q-item-section side>
              <q-avatar rounded size="48px">
                <img :src="chat[1]?.friendInfo.photoURL" />
                <div
                  class="rounded-full h-3 w-3 absolute -top-1 -right-1 shadow border z-10"
                  :class="`${
                    chat[1]?.friendInfo.online ? 'bg-green-600' : 'bg-red-600'
                  }`"
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-black text-lg">{{
                chat[1]?.friendInfo.displayName
              }}</q-item-label>

              <div class="flex space-x-2 items-end mt-1">
                <img
                  :src="chat[1]?.lastMessage?.img"
                  v-if="chat[1]?.lastMessage?.img"
                  class="h-4 w-4"
                />
                <q-item-label caption v-if="chat[1]?.lastMessage?.text">{{
                  chat[1]?.lastMessage?.text
                }}</q-item-label>
              </div>
            </q-item-section>
            <q-item-section side
              ><q-btn
                round
                :color="`${selectedArray.includes(chat[0]) ? 'blue' : 'white'}`"
                class="text-white border"
                icon="done"
            /></q-item-section>
          </q-item>
        </div>
        <div
          v-if="!userStore.userChats && !loading"
          class="flex flex-col space-y-4 items-center justify-center my-10 font-bold"
        >
          <p class="text-lg">You have no recent chats.</p>
          <p>Add a friend to start chatting.</p>
        </div>

        <q-spinner
          v-if="loading"
          color="green"
          size="3em"
          :thickness="2"
          class="left-[45%] top-[45%] absolute"
        />
      </div>
      <q-btn
        label="Send New"
        class="absolute bottom-2 right-4 rounded-[1rem] bg-yellow font-bold text-sm text-black"
        @click.prevent="sendNewSnap"
        ><q-icon name="send" class="ml-2"
      /></q-btn>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
