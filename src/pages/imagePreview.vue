<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useChatStore } from '../stores/chatStore';
import { useRouter } from 'vue-router';

// import Camera from 'simple-vue-camera';

const chatStore = useChatStore();
const router = useRouter();
</script>

<template>
  <div class="row items-center justify-evenly h-[calc(100vh)]">
  <router-link to="/capture"><q-icon name="arrow_back" /></router-link>
  <img class="h-full w-full" :src="chatStore.currentCamPic">
  </div>
</template>

<style scoped></style>
