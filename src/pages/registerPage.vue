<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const isPwd = ref(true);

const loading = ref(false);

function simulateProgress() {
  // we set loading state
  loading.value = true;

  // simulate a delay
  setTimeout(() => {
    // we're done, we reset loading state
    loading.value = false;
    alert('successfully registered');
    router.replace('/');
  }, 3000);
}
</script>

<template>
  <div class="p-4 flex flex-col items-center space-y-8">
    <div class="text-h4">CHAT APP LOGO</div>
    <div class="text-h6">Register Now</div>
    <div class="flex flex-col items-center space-y-4 w-10/12">
      <div class="flex space-x-4 items-center">
        <q-input
          outlined
          standout
          rounded
          v-model="firstName"
          label="First Name"
          class="w-[47%]"
        >
        </q-input
        ><q-input
          outlined
          standout
          rounded
          v-model="lastName"
          label="Last Name"
          class="w-[47%]"
        >
        </q-input>
      </div>
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
        label="Sign Up"
      />
    </div>
  </div>
</template>
