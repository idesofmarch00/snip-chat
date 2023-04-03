<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../boot/firebase';
import { useUserStore } from '../stores/userStore';
import _ from 'lodash';
import { date as qDate } from 'quasar';

const userStore = useUserStore();

onMounted(() => {
  onSnapshot(doc(db, 'userChats', userStore.user.uid), (doc) => {
    userStore.setUserChats(doc.data());
  });
  console.log(userStore.userChats);

  // const orderedChats = computed(() => {
  //   return userStore.userChats.filter((chats: any) => {
  //     return chats[1].date.seconds;
  //   });
  // });
  // userStore.setUserChats(_.orderBy(userStore.userChats, orderedChats));
});

const today = new Date();
</script>

<template>
  <q-page class="items-center justify-evenly">
    <q-item
      clickable
      v-ripple
      v-for="chat in userStore.userChats"
      :key="chat.friendInfo.uid"
    >
      <q-item-section side>
        <q-avatar rounded size="48px">
          <img :src="chat.friendInfo.photoURL" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-black">{{
          chat.friendInfo.displayName
        }}</q-item-label>
        <q-item-label caption></q-item-label>
      </q-item-section>
      <q-item-section side>
        <!-- {{ chat.date.seconds }} -->
        <!-- {{ qDate.getDateDiff(today, chat.date.seconds.toDate, 'minutes') }} -->
      </q-item-section>
    </q-item>
  </q-page>
</template>
