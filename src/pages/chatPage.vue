<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="flex justify-center items-center">
          <q-icon name="arrow_back" round class="absolute left-6"/>
          <span class="text-xl">{{}}Chat</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- <q-banner
  		v-if="!otherUserDetails.online"
  		class="bg-grey-4 text-center fixed-top">
      {{ otherUserDetails.name }} is offline.
    </q-banner>
  	<divspa items-
  		:class="{ 'invisible' : !showMessages }"
  		class="q-pa-md column col justify-end">
  		<q-chat-message
  			v-for="(message, key) in messages"
  			:key="key"
  		  :name="message.from == 'me' ? userDetails.name : otherUserDetails.name"
  		  :text="[message.text]"
  		  :sent="message.from == 'me' ? true : false"
  		  :bg-color="message.from == 'me' ? 'white' : 'light-green-2'"
  		/>
  	</divspa> -->

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-form @submit="sendMessage" class="full-width">
            <q-input
              v-model="newMessage"
              @blur="scrollToBottom"
              ref="newMessage"
              bg-color="white"
              outlined
              rounded
              label="Message"
              dense
            >

                <q-btn
                  round
                  dense
                  flat
                  type="submit"
                  color="white"
                  icon="photo_camera"
                />
                <template v-slot:after>
                <q-btn
                  round
                  dense
                  flat
                  type="submit"
                  color="white"
                  icon="attach_file"
                />
                <q-btn
                  round
                  dense
                  flat
                  type="submit"
                  color="white"
                  icon="send"
                />
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
function sendMessage() {
  console.log('sent');
}

function scrollToBottom() {
  console.log('blur scroll');
}
</script>

<style scoped></style>
