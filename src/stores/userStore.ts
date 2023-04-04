import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const showLocationPopup = ref<boolean>(false);

  const user = ref<any>(null);
  const allUsers = ref([]);
  const userClaim = ref<any>();
  const userIdToken = ref<any>();
  const userChats = ref();
  const currentChat = ref();

  function setUser(firebaseUser: any) {
    user.value = firebaseUser;
  }

  function setAllUsers(users: any) {
    allUsers.value = users;
  }

  function setUserClaim(userRole: any) {
    userClaim.value = userRole;
  }

  function setUserChats(chats: any) {
    userChats.value = chats;
  }

  function toggleLocationPopup(displayState: boolean) {
    showLocationPopup.value = displayState;
  }

  function setCurrentChat(messages:any){
    currentChat.value=messages;
  }

  return {
    user,
    userClaim,
    userIdToken,
    setUser,
    setUserClaim,
    userChats,
    setUserChats,
    showLocationPopup,
    toggleLocationPopup,
    setAllUsers,
    allUsers,
    setCurrentChat,
currentChat,
  };
});
