<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const password = ref('');
const isPwd =ref(true);

const loading = ref(false);

function simulateProgress () {
      // we set loading state
      loading.value = true

      // simulate a delay
      setTimeout(() => {
        // we're done, we reset loading state
        loading.value = false
        router.replace('/');
      }, 3000)
    }
</script>

<template>
  <div class="p-4">
    <q-input
      outlined
      standout
      rounded
      v-model="username"
      label="Username"
    >
    </q-input>


    <q-input v-model="password" label="Password" standout rounded outlined  :type="isPwd ? 'password' : 'text'">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>


      <q-btn :loading="loading" color="secondary" class="glossy" rounded @click="simulateProgress" label="Button" />

  </div>
</template>
