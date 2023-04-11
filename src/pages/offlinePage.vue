<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

//imports firebase

//store
const router = useRouter();
</script>

<template>
  <div
    class="p-4 flex flex-col items-center h-[calc(100vh)] text-violet-900 text-2xl font-bold"
  >
    <div class="flex flex-col w-10/12 space-y-8 items-center">
      <div class="flex flex-col items-center space-y-2">
        <p class="text-h4">OOPS !</p>
        <p>The app is offline.</p>
      </div>

      <img src="../assets/sleepy.png" class="h-52 w-52" />
      <div>
        <q-icon name="signal_wifi_off" color="black" class="" size="15vh" />
      </div>
      <p class="text-center">You have lost connection to the internet.</p>

      <q-btn to="/dashboard" class="text-white shadow-sm bg-violet-600">GO BACK</q-btn>
    </div>
  </div>
</template>

<style scoped></style>
