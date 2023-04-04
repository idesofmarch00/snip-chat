<script setup lang="ts">
//dependencies
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

//store
import { useUserStore } from '../stores/userStore';

//imports
import Spinner from './customSpinner.vue';

//services
import { signOut } from 'firebase/auth';
import { auth, db } from '../boot/firebase';

const router = useRouter();
const loading = ref<boolean>(false);
const state = ref<string>('');
const userStore = useUserStore();

onMounted(async () => {
  state.value = (
    await window.navigator.permissions.query({ name: 'geolocation' })
  ).state;
});

function enableLocation() {
  loading.value = true;

  window.navigator.geolocation.getCurrentPosition(
    () => {
      loading.value = false;
      userStore.toggleLocationPopup(false);
    },
    () => {
      state.value = 'denied';
      loading.value = false;
    }
  );
  if (!loading.value && state.value === 'denied') {
    location.reload();
  }
}

const logout = () => {
  signOutUser();
  userStore.toggleLocationPopup(false);
  router.push('/login');
  loading.value = false;
};

function signOutUser() {
  signOut(auth);
  router.replace('/login');
}
</script>

<template>
  <q-dialog
    v-model="userStore.showLocationPopup"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-teal text-white" style="width: 300px">
      <div class="bg-white">
        <p
          class="w-full text-center text-lg pb-4 font-bold"
          v-if="state === 'denied'"
        >
          Please enable location access in device settings
        </p>
        <p class="w-full text-center text-lg pb-4 font-bold" v-else>
          Please enable location to continue
        </p>
        <div class="w-full flex space-x-4 justify-center">
          <button @click="logout" class="bg-red-500" v-if="state === 'denied'">
            Logout
          </button>
          <button
            @click="enableLocation"
            class="bg-green-600 text-sm h-auto normal-case"
            v-if="!loading && state === 'denied'"
          >
            Try Again
          </button>

          <button
            @click="enableLocation"
            class="bg-green-600 text-sm h-auto normal-case"
            v-if="!loading && state !== 'denied'"
          >
            Enable Location
          </button>
          <Spinner :size="'spinner-lg'" :color="'green-spin'" v-if="loading" />
        </div>
      </div>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
