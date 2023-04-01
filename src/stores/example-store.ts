import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNavStore = defineStore('useNavStore', () => {
  const tab = ref('');

  function setTab(tab: any) {
    tab.value = tab;
  }

  return {
    tab,
    setTab,
  };
});

export default useNavStore;
