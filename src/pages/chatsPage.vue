<script setup lang="ts">
import { ref, onMounted, computed, onBeforeMount } from 'vue';
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
import { useRouter } from 'vue-router';

import * as timeago from 'timeago.js';

import { useQuasar } from 'quasar';
const $q = useQuasar();

const userStore = useUserStore();
let allChats: any = [];
const sortedChats = ref();

const router = useRouter();

onMounted(async () => {
  loading.value = true;

  const user = await getCurrentUser();
  if (user) {
    try {
      await onSnapshot(doc(db, 'userChats', userStore.user.uid), (doc) => {
        allChats = doc.data();
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

async function saveFriend(friend: any) {
  router.replace('/chat/' + friend[0]);
  //     if (friend[1]?.lastMessage?.snap) {
  //   router.replace('/newSnap');
  //   await updateDoc(doc(db, 'userChats', userStore.user.uid), {
  //             [friend[0] + '.lastMessage']: {
  //               msg:'You viewed a snap'
  //             },
  //             [friend[0] + '.date']: serverTimestamp(),
  //           });

  //           await updateDoc(doc(db, 'userChats', friend[0].replace(userStore.user.uid, '')), {
  //             [friend[0] + '.lastMessage']: {
  //               msg:'You viewed a snap'
  //             },
  //             [friend[0] + '.date']: serverTimestamp(),
  //           });
  //   userStore.setCurrentChatFriend(friend);
  // } else {
  //   router.replace('/chat/' + friend[0]);
  userStore.setCurrentChatFriend(friend);
  // }
}

function Sort() {
  sortedChats.value = Object.entries(allChats)?.sort(
    (a: any, b: any) =>
      new Date(b[1]?.date?.toDate().toISOString()).getTime() -
      new Date(a[1]?.date?.toDate().toISOString()).getTime()
  );
  userStore.setUserChats(sortedChats.value);
  loading.value = false;
}
</script>

<template>
  <q-page
    class="items-center justify-evenly"
    :class="`${$q.dark.isActive ? 'bg-gray-700 ' : 'bg-white'}`"
  >
    <div
      v-if="userStore.userChats?.length && !loading"
      class="my-2 flex flex-col items-center space-y-3"
    >
      <q-item
        @click.prevent="saveFriend(chat)"
        clickable
        v-ripple
        v-for="chat in sortedChats"
        :key="chat[0]"
        class="w-full"
        :class="`${
          $q.dark.isActive
            ? 'bg-gray-600 border-[0.5px] border-teal-700'
            : 'bg-violet-100'
        }`"
      >
        <q-item-section side>
          <q-avatar rounded size="48px">
            <img :src="chat[1]?.friendInfo?.photoURL" />
            <!-- <div
              class="rounded-full h-3 w-3 absolute -top-1 -right-1 shadow border z-10"
              :class="`${
                chat[1]?.friendInfo?.online ? 'bg-green-600' : 'bg-red-600'
              }`"
            /> -->
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label
            class="text-lg"
            :class="`${$q.dark.isActive ? 'text-teal-50' : 'text-violet-900'}`"
            >{{ chat[1]?.friendInfo?.userName }}</q-item-label
          >

          <div
            class="flex space-x-2 items-end mt-1"
            v-if="!chat[1]?.lastMessage?.snap && !chat[1]?.lastMessage?.msg"
            :class="`${$q.dark.isActive ? 'text-teal-100' : 'text-gray-300'}`"
          >
            <img
              :src="chat[1]?.lastMessage?.img"
              v-if="chat[1]?.lastMessage?.img"
              class="h-4 w-4"
            />
            <q-item-label
              class="w-40 truncate ..."
              caption
              v-if="chat[1]?.lastMessage?.text"
              >{{ chat[1]?.lastMessage?.text }}</q-item-label
            >
          </div>
          <div
            class="flex space-x-2 items-end mt-1 font-mono"
            :class="`${$q.dark.isActive ? 'text-teal-100' : 'text-gray-600'}`"
          >
            <q-item-label caption v-if="!chat[1]?.lastMessage"
              >(Send your first message!)</q-item-label
            >
          </div>
          <div
            v-if="chat[1]?.lastMessage?.snap"
            class="text-xs mt-1"
            :class="`${$q.dark.isActive ? 'text-teal-100' : 'text-gray-600'}`"
          >
            {{ timeago.format(chat[1]?.date?.toDate().toISOString()) }}
          </div>
          <div
            v-if="chat[1]?.lastMessage?.msg"
            class="py-[0.15rem] px-1 rounded-lg h-5 w-fit text-[0.6rem] mt-1"
            :class="`${
              $q.dark.isActive
                ? 'text-teal-700 border border-teal-300 bg-teal-100'
                : 'text-gray-700 border border-gray-400 bg-slate-50  '
            }`"
          >
            {{ chat[1]?.lastMessage?.msg }}
          </div>
        </q-item-section>
        <q-item-section
          side
          v-if="
            !chat[1]?.lastMessage?.snap &&
            !chat[1]?.lastMessage?.msg &&
            chat[1]?.lastMessage
          "
          :class="`${$q.dark.isActive ? 'text-teal-100' : 'text-gray-600'}`"
          >{{
            timeago.format(chat[1]?.date?.toDate().toISOString())
          }}</q-item-section
        >
        <q-item-section side v-if="chat[1]?.lastMessage?.snapMessage"
          ><img src="../assets/red.svg"
        /></q-item-section>
        <q-item-section
          side
          v-if="chat[1]?.lastMessage?.msg?.includes('viewed')"
          ><q-icon name="crop_square" size="xl" color="red"
        /></q-item-section>
        <q-item-section
          side
          v-if="
            !chat[1]?.lastMessage?.msg?.includes('viewed') &&
            chat[1]?.lastMessage?.msg
          "
          ><img src="../assets/red.svg"
        /></q-item-section>
        <q-item-section side v-if="!chat[1]?.lastMessage"
          ><q-icon name="send" color="blue" size="lg"
        /></q-item-section>
      </q-item>
    </div>
    <div
      v-if="!userStore.userChats?.length && !loading"
      class="flex flex-col space-y-4 items-center justify-center my-10 font-bold"
      :class="`${$q.dark.isActive ? 'text-teal-50' : 'text-black'}`"
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
  </q-page>
</template>

<style scoped></style>
