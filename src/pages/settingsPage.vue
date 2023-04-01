<template>
  <q-page class="q-pa-md">
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
            <q-item-label>Notification Sound</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="notificationSound" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Location Sharing</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="locationSharing" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Language</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-select v-model="selectedLanguage" :options="languageOptions" />
          </q-item-section>
        </q-item>
      </q-list>

      <p class="underline font-bold text-sm text-red-700">Delete Account</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const darkMode = ref(false);
const notificationSound = ref(true);
const locationSharing = ref(true);
const selectedLanguage = ref('');
const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
];
</script>
