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

    <q-banner class="bg-grey-4 text-center sticky top-10 z-10">
      user is offline.
    </q-banner>

    <!-- <div class="bg-red-50 max-h-[calc(100vh-20rem)] mt-12"></div> -->
    <q-page-container class="bg-red-50">
      <q-page>
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
          <q-form @submit="handleSend" class="full-width">
            <q-input
              v-model="newMessage"
              @blur="scrollToBottom"
              bg-color="white"
              outlined
              rounded
              placeholder="Message"
              dense
              ><input
                @change="createImage"
                name="upload"
                type="file"
                placeholder="upload"
                class="text-base"
                accept="image/*"
                capture="environment"
                ref="clickimage"
                hidden
              />
              <template v-slot:after>
                <q-btn
                  @click="clickImage"
                  round
                  dense
                  flat
                  color="white"
                  icon="photo_camera"
                />
                <q-btn round dense flat color="white" icon="attach_file" />
                <q-btn
                  round
                  dense
                  flat
                  color="white"
                  icon="send"
                  @click.prevent="handleSend"
                />
              </template>
            </q-input>
          </q-form>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>

  <q-dialog
    v-model="imagePreviewModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="pt-2 text-white" style="width: 200px">
      <div
        class="w-full flex flex-col space-y-1 items-center justify-center"
        @submit.prevent=""
      >
        <div class="h-40 w-40 bg-slate-200 rounded-lg relative">
          <q-spinner color="primary" size="3em" :thickness="2" v-if="loading" />
          <button
            v-if="imageSrc"
            @click="
              () => {
                file = null;
                imageSrc = '';
              }
            "
            class="absolute w-5 h-5 -top-2 -right-2 bg-gray-600 text-white text-md border rounded-full container-center justify-center"
          >
            <span class="">x</span>
          </button>
          <img
            v-show="imageSrc"
            :src="imageSrc"
            alt="totalizer"
            class="rounded-lg h-full w-full"
          />
        </div>
      </div>

      <q-card-actions align="center" class="bg-white text-teal mb-2 p-0">
        <q-btn flat label="Save" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
//dependencies
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
//imports
import { db, storage } from '../boot/firebase';
import { v4 as uuid } from 'uuid';
import {
  getDownloadURL,
  ref as fireStorageRef,
  uploadBytesResumable,
} from 'firebase/storage';

//lifecycle hooks
const route = useRoute();
onMounted(() => {
  console.log(route.params.combinedUserId);
});

//refs states
const newMessage = ref('');

//img upload
const loading = ref<boolean>(false);
const imageSrc = ref<any>('');
const clickimage = ref<HTMLDivElement | null>();
const file = ref<any>();
const imagePreviewModal = ref<boolean>(false);

function clickImage(e: Event) {
  if (e.target) {
    clickimage.value?.click();
  }
}

const createImage = async (e: any) => {
  loading.value = true;
  file.value = e.target.files[0];
  if (file.value) {
    imageSrc.value = URL.createObjectURL(e.target.files[0]);
    loading.value = false;
    imagePreviewModal.value = true;

  } else {
    imageSrc.value = '';
  }
};

//send msg
const handleSend = async () => {
  if (img) {
    const storageRef = ref(storage, uuid());

    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      (error) => {
        //TODO:Handle Error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(db, 'chats', data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        });
      }
    );
  } else {
    await updateDoc(doc(db, 'chats', data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
  }

  await updateDoc(doc(db, 'userChats', currentUser.uid), {
    [data.chatId + '.lastMessage']: {
      text,
    },
    [data.chatId + '.date']: serverTimestamp(),
  });

  await updateDoc(doc(db, 'userChats', data.user.uid), {
    [data.chatId + '.lastMessage']: {
      text,
    },
    [data.chatId + '.date']: serverTimestamp(),
  });

  setText('');
  setImg(null);
};

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
