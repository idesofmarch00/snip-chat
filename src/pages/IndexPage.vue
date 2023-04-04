<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../boot/firebase';
import { useUserStore } from '../stores/userStore';
import _ from 'lodash';
import { date as qDate } from 'quasar';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const allChats: any = [];

const router = useRouter();

onMounted(() => {
  onSnapshot(doc(db, 'userChats', userStore.user.uid), (doc) => {
    userStore.setUserChats(doc.data());
  });

  {
    Object.entries(userStore.userChats)
      ?.sort((a, b) => b[1].date - a[1].date)
      .map((chat) => allChats.push(chat));
  }
});

function goToChat(chat: any) {
  router.replace(`/chat/${chat[0]}`);
}

const today = new Date();
</script>

<template>
  <q-page class="items-center justify-evenly">
    <q-item
      @click.prevent="goToChat(chat)"
      clickable
      v-ripple
      v-for="chat in allChats"
      :key="chat[1].friendInfo.uid"
    >
      <q-item-section side>
        <q-avatar rounded size="48px">
          <img :src="chat[1].friendInfo.photoURL" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-black">{{
          chat[1].friendInfo.displayName
        }}</q-item-label>
        <q-item-label caption></q-item-label>
      </q-item-section>
      <q-item-section side>
        {{ chat[1].date.seconds }}
      </q-item-section>
    </q-item>
  </q-page>
</template>
