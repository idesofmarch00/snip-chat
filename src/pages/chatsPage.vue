<script setup lang="ts">
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import {
  doc,
  onSnapshot,
  collection,
  query,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db, getCurrentUser } from '../boot/firebase';
import { useUserStore } from '../stores/userStore';
import _ from 'lodash';
import { date as qDate } from 'quasar';
import { useRouter } from 'vue-router';

import * as timeago from 'timeago.js';

const userStore = useUserStore();
let allChats: any = [];
const sortedChats = ref();

const router = useRouter();

onMounted(async () => {
  const user = await getCurrentUser();
  if (user) {
    try {
      await onSnapshot(doc(db, 'userChats', userStore.user.uid), (doc) => {
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

const today = new Date();

function saveFriend(friend: any) {
  router.replace('/chat/' + friend[0]);
  userStore.setCurrentChatFriend(friend);
}

function Sort() {
  sortedChats.value = Object.entries(allChats)?.sort(
    (a: any, b: any) =>
      new Date(b[1].date.toDate().toISOString()).getTime() -
      new Date(a[1].date.toDate().toISOString()).getTime()
  );
}
</script>

<template>
  <q-page class="items-center justify-evenly">
    <div
      v-if="userStore.userChats"
      class="my-2 flex flex-col items-center space-y-3"
    >
      <q-item
        @click.prevent="saveFriend(chat)"
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
          <q-item-label class="text-black">{{
            chat[1]?.friendInfo.displayName
          }}</q-item-label>
          <q-item-label caption v-if="chat[1]?.lastMessage?.text">{{
            chat[1]?.lastMessage?.text
          }}</q-item-label>
          <img
            :src="chat[1]?.lastMessage?.img"
            v-if="chat[1]?.lastMessage?.img"
            class="h-4 w-4"
          />
        </q-item-section>
        <q-item-section side>{{
          timeago.format(chat[1]?.date?.toDate().toISOString())
        }}</q-item-section>
      </q-item>
    </div>
    <div
      v-else
      class="flex flex-col space-y-4 items-center justify-center my-10 font-bold"
    >
      <p class="text-lg">You have no recent chats.</p>
      <p>Add a friend to start chatting.</p>
    </div>
  </q-page>
</template>
