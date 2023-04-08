<script setup lang="ts">
//dependencies
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

//store
import { useUserStore } from '../stores/userStore';

//imports

const userStore = useUserStore();
const userFromLocalStorage = localStorage.getItem('user');

onMounted(() => {
  if (userStore.user || userFromLocalStorage === 'true') {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
});

const router = useRouter();
</script>

<template>
  <div class="flex flex-col space-y-4 items-center justify-center min-h-screen">
    <h1 class="text-center font-bold text-5xl">Snip Chat</h1>
    <img src="../assets/handshake.png" />
    <div>
      <q-spinner color="blue" size="5em" :thickness="2" />
    </div>
  </div>
</template>

<style scoped></style>
