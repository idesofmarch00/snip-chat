<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
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
      localStorage.setItem('user', true.toString());
      router.replace('/dashboard');
    } catch (err) {
      $toast('Error Login', 'error', 'top');
      loading.value = false;
    }
  }, 2000);
}

onBeforeMount(() => {
  if (localStorage.getItem('user') === 'true') {
    router.replace('/dashboard');
  }
});
</script>

<template>
  <div class="p-4 flex flex-col items-center space-y-8">
    <div class="flex flex-col items-center space-y-4">
      <div class="text-h4">
        <img src="../assets/favicon.png" class="h-40 w-40" />
      </div>
      <div class="text-h6">Welcome Back !</div>
    </div>
    <div class="flex flex-col items-center space-y-4 w-10/12">
      <q-input outlined standout v-model="email" label="Email" class="w-full">
      </q-input>

      <q-input
        v-model="password"
        label="Password"
        class="w-full"
        standout
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
        class="glossy w-full h-10 text-lg bg-violet-800 text-white"
        @click="simulateProgress"
        label="Sign In"
      />

      <div
        class="flex items-center justify-center flex-col space-y-2 border-b-2 p-4 w-full h-full my-4"
      >
        <p class=" text-gray-600 mb-4 text-lg">or</p>
        <div class="flex flex-col items-center space-y-1">

            <div
              class="rounded flex items-center h-12 w-52 google-blue text-gray-100 hover:text-white shadow font-bold text-sm "
              @click.prevent="simulateProgress"
            >
              <div class="bg-white h-12 w-12 mr-2 flex items-center justify-center">
              <img src="../assets/google.png" class="h-8 w-8"/>
              </div> 
              <div class="pl-3 ">Sign in with Google</div>
            </div>

            <!-- <div
              class="bg-gray-900 text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer w-64 mt-2"
            >
              <svg
                viewBox="0 0 24 24"
                class="fill-current mr-3 w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
              <span class="border-l border-gray-800 h-6 w-1 block mr-1"></span>
              <span class="pl-3">Sign up with Github</span>
            </div>

            <div
              class="bg-indigo-600 text-gray-100 hover:text-white shadow text-sm font-bold py-3 px-4 rounded flex justify-start items-center cursor-pointer w-64 mt-2"
            >
              <svg
                viewBox="0 0 24 24"
                class="fill-current mr-3 w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z"
                />
              </svg>
              <span
                class="border-l border-indigo-500 h-6 w-1 block mr-1"
              ></span>
              <span class="pl-3">Sign up with Facebook</span>
            </div>-->
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

<style scoped>
.google-blue {
  background: #4285f4;
}
</style>
