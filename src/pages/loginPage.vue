<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

//imports firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../boot/firebase';

import { $toast } from '../utils/notification';

//store
import { useUserStore } from '../stores/userStore';
const userStore = useUserStore();

const router = useRouter();

const email = ref('');
const password = ref('');
const isPwd = ref(true);

const loading = ref(false);

function simulateProgress() {
  // we set loading state
  loading.value = true;

  // simulate a delay
  setTimeout(async () => {
    // we're done, we reset loading state

    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      loading.value = false;
      router.replace('/dashboard');
    } catch (err) {
      $toast('Error Login', 'error', 'top');
      loading.value = false;
    }
  }, 2000);
}
</script>

<template>
  <div class="p-4 flex flex-col items-center space-y-8">
    <div class="text-h4">CHAT APP LOGO</div>
    <div class="text-h6">Welcome Back !</div>
    <div class="flex flex-col items-center space-y-4 w-10/12">
      <q-input
        outlined
        standout
        rounded
        v-model="email"
        label="Email"
        class="w-full"
      >
      </q-input>

      <q-input
        v-model="password"
        label="Password"
        class="w-full"
        standout
        rounded
        outlined
        :type="isPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <q-btn
        :loading="loading"
        color="secondary"
        class="glossy w-10/12"
        rounded
        @click="simulateProgress"
        label="Sign In"
      />

      <div
        class="flex items-center flex-col space-y-2 border-b-2 p-4 w-full h-full my-4"
      >
        <p class="font-bold text-gray-600">or</p>
        <div class="flex space-x-4">
          <q-btn padding="xs" color="primary" icon="g_translate" /><q-btn
            padding="xs"
            color="primary"
            icon="class"
          /><q-btn padding="xs" color="primary" icon="apple" />
        </div>
      </div>

      <p class="text-sm">
        Not a member ?
        <router-link to="/register"
          ><span class="underline font-bold text-red-500"
            >Register Now</span
          ></router-link
        >
      </p>
    </div>
  </div>
</template>
