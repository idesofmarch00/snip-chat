<script setup lang="ts">
import { ref,watch } from 'vue';
import { useChatStore } from '../stores/chatStore';

const chatStore = useChatStore();

function clickPic(){
  chatStore.setCurrentCamPic(Math.random()*100)
}

watch(chatStore,(updatedChatStore) => {
console.log(updatedChatStore.currentCamPic);
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click.prevent="clickPic" label="click"/>
  </q-page>
</template>
