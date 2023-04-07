import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chatStore', () => {
  const currentCamPic = ref();
  const currentCamPicURL = ref();
  const currentSnapToDelete = ref();

  function setCurrentCamPic(pic: any) {
    currentCamPic.value = pic;
  }

  function setCurrentCamPicURL(picUrl: any) {
    currentCamPicURL.value = picUrl;
  }

  function setCurrentSnapToDelete(msgId: any) {
    currentSnapToDelete.value = msgId;
  }

  return {
    currentCamPic,
    setCurrentCamPic,
    setCurrentCamPicURL,
    currentCamPicURL,
    setCurrentSnapToDelete,
    currentSnapToDelete,
  };
});
