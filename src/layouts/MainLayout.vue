<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar class="bg-gray-800 p-2">
        <!-- <q-btn dense flat round icon="menu" /> -->
        <q-avatar @click="toggleLeftDrawer">
          <img :src="userStore?.user?.photoURL" />
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
            <q-route-tab name="Chats" icon="question_answer" to="/dashboard" />
            <q-separator vertical inset class="bg-yellow-2" />
            <q-route-tab name="Capture" icon="camera" to="/capture" />
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
        placeholder="Search by username or email"
        v-model="search"
        input-class="text-left"
        class="w-11/12 ml-4 mb-2"
      >
        <template v-slot:append>
          <q-icon v-if="search === ''" name="search" />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="
              () => {
                userSearch = false;
                search = '';
              }
            "
          />
        </template>
      </q-input>

      <!-- list of users -->
      <q-card
        class="w-full max-h-[calc(100vh-5rem)] flex flex-col space-y-0 overflow-auto bg-white"
      >
        <!-- card -->
        <div
          v-if="!userSearch && search === ''"
          class="text-black font-bold text-lg text-center mt-2"
        >
          Find users
        </div>

        <div
          v-if="!userSearch && search !== ''"
          class="text-black font-bold text-lg text-center mt-2"
        >
          No User Found
        </div>
        <button
          v-if="userSearch && search !== ''"
          @click.prevent="handleSelect"
        >
          <q-item
            class="flex items-center justify-between ml-2 my-2 w-11/12 rounded-lg p-2 border"
          >
            <q-item-section class="w-1/2">
              <q-avatar>
                <img :src="friend?.photoURL" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-black font-bold text-lg">{{
                friend.displayName
              }}</q-item-label>
              <q-item-label caption lines="1">{{ friend.email }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chat_bubble" color="grey" />
            </q-item-section>
          </q-item>
        </button>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Close" v-close-popup />
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
import { $toast } from 'src/utils/notification';

const userStore = useUserStore();

const route = useRoute();
const router = useRouter();

const leftDrawerOpen = ref(false);
const addFriendModal = ref(false);
const users = ref(true);
const search = ref('');
const tab = ref('');

const link = ref('');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logOut() {
  link.value = 'logout';
  signOut(auth);
  localStorage.setItem('user',false.toString());
  router.replace('/login');
  
}

watch(route, (updatedRoute) => {
  if (updatedRoute.name in ['Chats', 'Map', 'Capture']) {
    tab.value = updatedRoute.name;
  } else {
    tab.value = updatedRoute.name;
  }
});

const friend = ref();
const userSearch = ref(false);
watch(search, (updatedSearch) => {
  friend.value = '';
  handleSearch(updatedSearch);
});

async function handleSearch(search) {
  const q = query(collection(db, 'users'), where('displayName', '==', search));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      friend.value = doc.data();
      userSearch.value = true;
    });
  } catch (err) {
    console.log(err);
    userSearch.value = false;
  }
}

const handleSelect = async () => {
  //check whether the group(chats in firestore) exists, if not create
  const combinedId =
    userStore.user.uid > friend.value.uid
      ? userStore.user.uid + friend.value.uid
      : friend.value.uid + userStore.user.uid;
  try {
    const res = await getDoc(doc(db, 'chats', combinedId));

    if (!res.exists()) {
      //create a chat in chats collection
      await setDoc(doc(db, 'chats', combinedId), { messages: [] });
      //create friend chats
      await updateDoc(doc(db, 'userChats', userStore.user.uid), {
        [combinedId + '.friendInfo']: {
          uid: friend.value.uid,
          displayName: friend.value.displayName,
          photoURL: friend.value.photoURL,
          online:true,
        },
        [combinedId + '.date']: serverTimestamp(),
      });
      await updateDoc(doc(db, 'userChats', friend.value.uid), {
        [combinedId + '.friendInfo']: {
          uid: userStore?.user?.uid,
          displayName: userStore?.user?.displayName,
          photoURL: userStore?.user?.photoURL,
          online:true,
        },
        [combinedId + '.date']: serverTimestamp(),
      });

      $toast('Friend added successfully', 'success', 'top');
      addFriendModal.value = false;
    }
    else{
      alert('User is already a friend.')
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped lang="sass">
.my-menu-link
  color: white
  background: #fffff
</style>
