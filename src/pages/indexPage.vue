<script setup lang="ts">
//dependencies
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

//store
import { useUserStore } from '../stores/userStore';

//imports

const userStore = useUserStore();
const userFromLocalStorage = localStorage.getItem('user')

onMounted(()=>{  if (userStore.user || userFromLocalStorage==='true') {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
});

const router = useRouter();
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="mb-8 text-center">Welcome To my Chat App</h1>
    <div>
    <q-spinner
        color="primary"
        size="3em"
        :thickness="2"
      />
    </div>
  </div>
</template>

<style scoped></style>
