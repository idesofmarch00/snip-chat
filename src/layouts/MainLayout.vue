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

    <q-drawer
      dark
      :width="200"
      v-model="leftDrawerOpen"
      side="left"
      overlay
      elevated
    >
      <q-list bordered padding class="rounded-borders text-primary ">
        <q-item
          clickable
          v-ripple
          :active="link === 'profile'"
          @click="link = 'profile'"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>Profile</q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item
          clickable
          v-ripple
          :active="link === 'settings'"
          @click="link = 'settings'"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>Settings</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="link === 'help'"
          @click="link = 'help'"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>

          <q-item-section>Help</q-item-section>
        </q-item>

        <q-item
        clickable
        v-ripple
        :active="link === 'about'"
        @click="link = 'about'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>

        <q-item-section>About</q-item-section>
      </q-item>
      </q-list>



      <q-item
      class="fixed-bottom mb-2"
        clickable
        v-ripple
        :active="link === 'logout'"
        @click="link = 'logout'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>

        <q-item-section>Logout</q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-gray-800 p-2 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-tabs v-model="tab" class="bg-teal text-yellow shadow-2">
            <q-route-tab name="chat" icon="question_answer" to="/" />
            <q-route-tab name="camera" icon="camera" to="/pageThree" />
            <q-route-tab name="map" icon="public" to="/pageTwo" />
          </q-tabs>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lan="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

const leftDrawerOpen = ref(false);
const tab = ref('chat');

const route = useRoute();
const link = ref('');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
});
</script>

<style scoped lang="sass">
.my-menu-link
  color: white
  background: #fffff
</style>
