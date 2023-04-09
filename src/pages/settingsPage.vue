<template>
  <q-page
    class="q-pa-md text-xl font-bold"
    :class="`${$q.dark.isActive ? 'bg-gray-800' : 'bg-white'}`"
  >
    <div class="q-pa-md q-gutter-md">
      <q-list bordered>
        <q-item>
          <q-item-section>
            <q-item-label>Dark Mode</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="darkMode" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Notifications</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="notificationSound" />
          </q-item-section>
        </q-item>
        <!-- <q-item>
          <q-item-section>
            <q-item-label>Location Sharing</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="locationSharing" />
          </q-item-section>
        </q-item> -->
        <!-- <q-item>
          <q-item-section>
            <q-item-label>Language</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-select v-model="selectedLanguage" :options="languageOptions" />
          </q-item-section>
        </q-item> -->
      </q-list>

      <p
        @click.prevent="toggleDeleteAccount"
        class="underline font-bold text-sm"
        :class="`${$q.dark.isActive ? 'text-red-500 ' : 'text-red-700'}`"
      >
        Delete Account
      </p>
    </div>
  </q-page>

  <q-dialog
    v-model="deleteAccountModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-teal text-white" style="width: 300px">
      <q-card-section>
        <div class="text-h6">Are you sure?</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        You will not be able to retreive any details
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Yes" @click.prevent="deleteAccount" />
        <q-btn flat label="No" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { doc, deleteDoc } from 'firebase/firestore';
import { useUserStore } from '../stores/userStore';
import { db, auth } from '../boot/firebase';
import { useRouter } from 'vue-router';
import { deleteUser } from 'firebase/auth';

import { useQuasar } from 'quasar';
const $q = useQuasar();

const userStore = useUserStore();
const router = useRouter();

const darkMode = ref(userStore.darkMode);
const notificationSound = ref(true);
const locationSharing = ref(true);
const selectedLanguage = ref('');
// const languageOptions = [
//   { label: 'English', value: 'en' },
//   { label: 'Spanish', value: 'es' },
//   { label: 'French', value: 'fr' },
// ];

const deleteAccountModal = ref<boolean>(false);
const toggleDeleteAccount = () => {
  deleteAccountModal.value = true;
};

const deleteAccount = async () => {
  await deleteDoc(doc(db, 'users', userStore.user.uid));
  await deleteDoc(doc(db, 'userChats', userStore.user.uid));
  const user: any = auth.currentUser;

  deleteUser(user)
    .then(() => {
      router.replace('/login');
    })
    .catch((error) => {
      console.log('error deleting user');
    });
};

watch(darkMode, (updatedDarkMode) => {
  if (updatedDarkMode) {
    userStore.setDarkMode(true);
    $q.dark.toggle();
  } else {
    userStore.setDarkMode(false);
    $q.dark.toggle();
  }
});
</script>
