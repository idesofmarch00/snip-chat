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
</script>

<template>
  <q-page class="items-center justify-evenly">
    <div v-if="userStore.userChats">
      <q-item
        :to="'chat/'+ chat[0]"
        clickable
        v-ripple
        v-for="chat in Object.entries(userStore.userChats)"
        :key="chat[1]?.friendInfo.uid"
      >
        <q-item-section side>
          <q-avatar rounded size="48px">
            <img :src="chat[1]?.friendInfo.photoURL" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-black">{{
            chat[1]?.friendInfo.displayName
          }}</q-item-label>
          <q-item-label caption></q-item-label>
        </q-item-section>
        <q-item-section side>
          {{ chat[1]?.date.seconds }}
        </q-item-section>
      </q-item>
    </div>
  </q-page>
</template>
