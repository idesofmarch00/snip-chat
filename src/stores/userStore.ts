import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const user = ref<any>(null);
  const userClaim = ref<any>();
  const userIdToken = ref<any>();

  const userChats = ref();

  const allUsers = ref();

  function setUser(firebaseUser: any) {
    user.value = firebaseUser;
  }

  function setUserClaim(userRole: any) {
    userClaim.value = userRole;
  }

  function setUserChats(chats: any) {
    userChats.value = chats;
  }

  function setAllUsers(users: any) {
    allUsers.value = users;
  }

  return {
    user,
    userClaim,
    userIdToken,
    setUser,
    setUserClaim,
    userChats,
    allUsers,
    setUserChats,
    setAllUsers,
  };
});
