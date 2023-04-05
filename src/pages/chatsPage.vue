<script setup lang="ts">
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, getCurrentUser } from '../boot/firebase';
import { useUserStore } from '../stores/userStore';
import _ from 'lodash';
import { date as qDate } from 'quasar';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const allChats: any = [];

const router = useRouter();

onMounted(async () => {
  const user = await getCurrentUser();
  if (user) {
    console.log(user);
    try {
      await onSnapshot(doc(db, 'userChats', userStore.user.uid), (doc) => {
        userStore.setUserChats(doc.data());
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    router.replace('/login');
  }
});

const today = new Date();

function saveFriend(friend:any){
  router.replace('/chat/'+friend[0]);
  userStore.setCurrentChatFriend(friend)
}
</script>

<template>
  <q-page class="items-center justify-evenly">
    <div v-if="userStore.userChats" class="my-2 flex flex-col items-center space-y-3">
      <q-item
        @click.prevent='saveFriend(chat)'
        clickable
        v-ripple
        v-for="chat in Object.entries(userStore.userChats)"
        :key="chat[1]?.friendInfo.uid"
        class="bg-gray-50 w-full"
      >
        <q-item-section side>
          <q-avatar rounded size="48px">
            <img :src="chat[1]?.friendInfo.photoURL" />
            <div class="rounded-full h-3 w-3 absolute -top-1 -right-1 shadow border z-10"
              :class="`${chat[1]?.friendInfo.online ? 'bg-green-600' : 'bg-red-600'}`"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-black">{{
            chat[1]?.friendInfo.displayName
          }}</q-item-label>
          <q-item-label caption>2 new messages</q-item-label>
        </q-item-section>
        <q-item-section side> 3 min ago </q-item-section>
      </q-item>
    </div>
    <div v-else class="flex flex-col space-y-4 items-center justify-center my-10 font-bold"><p class="text-lg">You have no recent chats.</p>
    <p>Add a friend to start chatting.</p></div>
  </q-page>
</template>
