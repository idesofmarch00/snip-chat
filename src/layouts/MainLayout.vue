<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar class="bg-gray-800 p-2">
        <!-- <q-btn dense flat round icon="menu" /> -->
        <q-avatar @click="toggleLeftDrawer">
          <img :src="userStore.photoURL" />
        </q-avatar>
        <q-toolbar-title class="mt-1 ml-12"> {{ route.name }} </q-toolbar-title>

        <q-btn
          icon="person_add"
          round
          class="bg-black"
          @click.prevent="addFriendModal = true"
        />
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
      <q-list bordered padding class="rounded-borders text-primary">
        <q-item
          clickable
          v-ripple
          :active="link === 'profile'"
          @click="link = 'profile'"
          active-class="my-menu-link"
          to="/profile"
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
          to="/settings"
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
          to="/helpSupport"
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
          to="/aboutUs"
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
        @click="logOut"
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
          <q-tabs
            v-model="tab"
            class="bg-teal rounded-full text-yellow shadow-2"
          >
            <q-route-tab name="Chats" icon="question_answer" to="/" />
            <q-separator vertical inset class="bg-yellow-2" />
            <q-route-tab name="Camera" icon="camera" to="/camera" />
            <q-separator vertical inset class="bg-yellow-2" />
            <q-route-tab name="Map" icon="public" to="/map" />
          </q-tabs>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>

  <q-dialog
    v-model="addFriendModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-teal text-white" style="width: 300px">
      <q-card-section>
        <div class="text-h6">Add Friend</div>
      </q-card-section>

      <q-input
        dark
        dense
        standout
        v-model="text"
        input-class="text-right"
        class="w-11/12 ml-4 mb-2"
      >
        <template v-slot:append>
          <q-icon v-if="text === ''" name="search" />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="text = ''"
          />
        </template>
      </q-input>

      <!-- list of users -->
      <q-spinner color="primary" size="3em" :thickness="2" v-if="!users" />
      <q-card
        v-else
        class="w-full max-h-[calc(100vh-5rem)] flex flex-col space-y-0 overflow-auto bg-white"
      >
        <!-- card -->
        <div class="container gap-y-4">
          <q-item
            class="q-mb-sm flex items-center justify-between bg-gray-300 rounded-lg p-2"
          >
            <div class="flex space-x-2 items-center w-full">
              <q-icon name="account_circle" color="black my-4" size="2.5rem" />

              <div class="flex flex-col space-y-2 items-start w-2/3">
                <div class="text-black font-bold">Name</div>
                <div class="text-gray-600">Email</div>
              </div>
            </div>

            <q-btn icon="send" color="black" class="h-4 w-10" />
          </q-item>
        </div>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup lan="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

//firebase
import { signOut } from 'firebase/auth';
import { auth, db } from '../boot/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

//store
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();

const route = useRoute();
const router = useRouter();

const leftDrawerOpen = ref(false);
const addFriendModal = ref(false);
const users = ref(true);
const text = ref('');
const tab = ref('');

const link = ref('');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logOut() {
  link.value = 'logout';
  signOut(auth);
  console.log;
  router.replace('/login');
}

watch(route, (updatedRoute) => {
  if (updatedRoute.name in ['Chats', 'Map', 'Camera']) {
    tab.value = updatedRoute.name;
  } else {
    tab.value = updatedRoute.name;
  }
});

watch(text, (updatedText) => {
  handleSearch(updatedText);
});

async function handleSearch(search) {
  const q = query(
    collection(db, 'users'),
    where('name', '==', search)
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
       console.log(doc.id, " => ", doc.data());
    });
  } catch (err) {
    setErr(true);
  }
}
</script>

<style scoped lang="sass">
.my-menu-link
  color: white
  background: #fffff
</style>
