import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chatStore', () => {
  const currentCamPic = ref();

  function setCurrentCamPic(pic: any) {
    currentCamPic.value = pic;
  }

  return {
    currentCamPic,
    setCurrentCamPic,
  };
});
