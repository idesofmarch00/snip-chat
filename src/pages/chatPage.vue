<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="flex justify-center items-center">
          <router-link to="/dashboard" class="absolute left-6"
            ><q-icon name="arrow_back" round class=""
          /></router-link>
          <span class="text-xl">{{}}Chat</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-banner class="bg-grey-4 text-center sticky top-10 z-10 " > user is offline. </q-banner>

    <!-- <div class="bg-red-50 max-h-[calc(100vh-20rem)] mt-12"></div> -->
    <q-page-container class="bg-red-50">
      <q-page >

        <div class="px-4 column col justify-end">
          <q-chat-message
            v-for="(message, key) in messages"
            :key="key"
            :name="
              message.from == 'me' ? userDetails.name : otherUserDetails.name
            "
            :text="[message.text]"
            :sent="message.from == 'me' ? true : false"
            :bg-color="message.from == 'me' ? 'white' : 'light-green-2'"
          />
        </div>
        <!-- place QPageScroller at end of page -->
        <q-page-scroller
          reverse
          position="top"
          :scroll-offset="2000"
          :offset="[0, 18]"
        >
          <q-btn fab icon="keyboard_arrow_down" color="accent" />
        </q-page-scroller>
      </q-page>
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-form @submit="submit" class="full-width">
            <q-input
              v-model="newMessage"
              @blur="scrollToBottom"
              bg-color="white"
              outlined
              rounded
              placeholder="Message"
              dense
            >
              <template v-slot:after>
                <q-btn round dense flat color="white" icon="photo_camera" />
                <q-btn round dense flat color="white" icon="attach_file" />
                <q-btn round dense flat color="white" icon="send" />
              </template>
            </q-input>
          </q-form>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const newMessage = ref('');

function submit() {
  console.log('submit');
}

function scrollToBottom() {
  console.log('blur scroll');
}

const userDetails = {
  name: 'sahil',
};

const otherUserDetails = {
  name: 'sohail',
};

const messages = [
  {
    from: 'me',
    text: 'hey',
  },
  {
    from: 'you',
    text: 'new phone who dis?',
  },
  {
    from: 'me',
    text: 'i am batman',
  },
  {
    from: 'you',
    text: 'stop inventing',
  },
  {
    from: 'me',
    text: 'Noooooo',
  },
  {
    from: 'me',
    text: 'i am batman',
  },
  {
    from: 'you',
    text: 'stop inventing',
  },
  {
    from: 'me',
    text: 'Noooooo',
  },
  {
    from: 'me',
    text: 'i am batman',
  },
  {
    from: 'you',
    text: 'stop inventing',
  },
  {
    from: 'me',
    text: 'Noooooo',
  },
];
</script>

<style scoped></style>
