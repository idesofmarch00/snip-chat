import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const user = ref();

  function setUser(user: any) {
    user.value = user;
  }

  return {
    user,
    setUser,
  };
});
