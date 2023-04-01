<template>
  <q-layout view="hHh LpR fFf">
    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar class="bg-gray-800 p-2">
        <!-- <q-btn dense flat round icon="menu" /> -->
        <q-avatar @click="toggleLeftDrawer">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
        <q-toolbar-title class="mt-1 ml-12"> Chat </q-toolbar-title>

        <q-btn icon="person_add" round class="bg-black" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay elevated>
      profile edit and settings privacy policy logout
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-gray-800 p-2 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-tabs v-model="tab" class="bg-teal text-yellow shadow-2">
            <q-route-tab name="chat" icon="question_answer" to="/pageTwo" />
            <q-route-tab name="camera" icon="camera" to="/pageThree" />
            <q-route-tab name="map" icon="public" to="/pageOne" />
          </q-tabs>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lan="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const tab = ref('chat');
</script>
