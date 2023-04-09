<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-violet-800 text-white">
      <q-toolbar>
        <q-toolbar-title class="flex justify-center items-center">
          <router-link to="/dashboard" class="absolute left-6"
            ><q-icon name="arrow_back" round class=""
          /></router-link>
          <span class="text-xl">{{
            userStore.currentChatFriend[1].friendInfo.userName
          }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- <q-banner
      :class="`${
        userStore?.currentChatFriend[1]?.friendInfo?.online
          ? 'bg-green-4 text-white font-bold text-lg'
          : 'bg-red-4 text-white'
      }`"
      class="text-center sticky top-10 z-10"
    >
      user is
      {{
        `${
          userStore?.currentChatFriend[1]?.friendInfo?.online
            ? 'online'
            : 'offline'
        }`
      }}.
    </q-banner> -->

    <!-- <div class="bg-red-50 max-h-[calc(100vh-20rem)] mt-12"></div> -->
    <q-page-container
      class="font-bold"
      :class="`${$q.dark.isActive ? 'bg-gray-800 ' : 'bg-teal-50'}`"
    >
      <q-page :class="`${$q.dark.isActive ? 'text-teal-50' : ''}`">
        <div class="px-4 column col justify-end" ref="pageChat">
          <q-chat-message
            class="text-lg font-bold mt-2"
            :label="date.formatDate(Date.now(), 'ddd , Do MMM')"
          />
          <div v-for="(message, key) in currentChat" :key="key" class="mb-6">
            <!-- :name="
                message.senderId == userStore.user.uid
                  ? 'Me'
                  : userStore.currentChatFriend[1].friendInfo.userName
              " -->
            <q-chat-message
              @click.prevent="goToSnap(message)"
              ref="chatMessageeRef"
              :sent="message.senderId == userStore.user.uid ? true : false"
              :bg-color="
                message.senderId == userStore.user.uid
                  ? 'light-blue-3'
                  : 'light-green-3'
              "
              :class="`${$q.dark.isActive ? 'text-teal-50' : ''}`"
              :avatar="
                message.senderId == userStore.user.uid
                  ? userStore.user.photoURL
                  : userStore.currentChatFriend[1].friendInfo.photoURL
              "
            >
              <div
                class="flex flex-col space-y-2"
                :class="`${$q.dark.isActive ? '!text-teal-900' : ''}`"
              >
                <img :src="message.img" />
                {{ message.text }}
                <q-chip
                  :class="`${$q.dark.isActive ? '!text-teal-900' : ''}`"
                  class="bg-transparent rounded-lg flex items-center space-x-4 w-full"
                  v-if="message.snap && message.senderId == userStore.user.uid"
                  ><img src="../assets/red.svg" class="h-8 w-8" />
                  <span>You have sent a new snap</span></q-chip
                >

                <q-chip
                  :class="`${$q.dark.isActive ? '!text-teal-900' : ''}`"
                  class="bg-transparent rounded-lg flex items-center space-x-4 w-full"
                  v-if="message.snap && message.senderId != userStore.user.uid"
                  ><img src="../assets/red.svg" class="h-8 w-8" />
                  <span>You have received a new snap</span></q-chip
                >
                <q-chip
                  :class="`${$q.dark.isActive ? '!text-teal-900' : ''}`"
                  class="bg-transparent rounded-lg flex items-center space-x-4 w-full"
                  v-if="
                    message.snapMessage &&
                    message.senderId == userStore.user.uid
                  "
                  ><q-icon name="crop_square" size="xl" color="red" />
                  <span>{{ message.snapMessage }}</span></q-chip
                >
                <q-chip
                  :class="`${$q.dark.isActive ? '!text-teal-900' : ''}`"
                  class="bg-transparent mr-6 rounded-lg flex items-center space-x-4 w-full"
                  v-if="
                    message.snapMessage &&
                    message.senderId != userStore.user.uid
                  "
                  ><q-icon name="crop_square" size="lg" color="red" />
                  <span>Snap viewed </span></q-chip
                >
              </div>
            </q-chat-message>
            <span
              v-if="message.date && !message.snap"
              class="font-medium text-[0.6rem]"
              :class="`${
                message.senderId == userStore.user.uid
                  ? 'absolute right-[3.8rem]'
                  : 'absolute left-[3.8rem]'
              }
              ${$q.dark.isActive ? 'text-teal-100' : 'text-gray-800'}`"
              >{{ timeago.format(message?.date?.toDate().toISOString()) }}</span
            >
          </div>
        </div>
        <!-- place QPageScroller at end of page -->
        <q-page-scroller
          reverse
          position="top"
          :scroll-offset="2000"
          :offset="[0, 18]"
        >
          <q-btn fab icon="keyboard_arrow_down" color="accent" ref="scroller" />
        </q-page-scroller>
      </q-page>
    </q-page-container>

    <q-footer
      class="bg-violet-900 h-16"
      :class="`${$q.dark.isActive ? 'text-teal-50' : 'text-white'}`"
    >
      <q-toolbar>
        <q-toolbar-title>
          <q-form @submit="handleSend" class="full-width">
            <q-input
              v-model="newMessage"
              :bg-color="$q.dark.isActive?'gray-700  ':'teal-50'"
              class="text-lg font-semibold"
              :class="$q.dark.isActive?'text-white ':'text-black'"
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
                ref="clickimage"
                hidden
              />
              <input
                @change="uploadFile"
                name="upload"
                type="file"
                placeholder="upload"
                class="text-base"
                ref="uploadFileRef"
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
                <q-btn
                  round
                  dense
                  flat
                  color="white"
                  icon="attach_file"
                  @click.prevent="getFile"
                />

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
    <q-card class="pt-2 text-white relative" style="width: 200px">
      <div
        class="w-full flex flex-col space-y-1 items-center justify-center"
        @submit.prevent=""
      >
        <div class="h-40 w-40 bg-slate-200 rounded-lg relative">
          <q-spinner color="primary" size="3em" :thickness="2" v-if="loading" />
          <img
            v-show="imageSrc"
            :src="imageSrc"
            alt="alt"
            class="rounded-lg h-full w-full"
          />
        </div>
      </div>

      <q-card-actions
        class="flex space-x-6 items-center justify-center bg-white mb-2 p-0"
      >
        <q-btn
          flat
          label="Cancel"
          @click="
            () => {
              file = null;
              imageSrc = '';
              imagePreviewModal = false;
            }
          "
          class="text-red"
        />
        <q-btn
          flat
          label="Send"
          @click.prevent="
            () => {
              handleSend();
              imagePreviewModal = false;
            }
          "
          class="text-green"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="filePreviewModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="pt-2 text-white relative" style="width: 200px">
      <div
        class="w-full flex flex-col space-y-1 items-center justify-center text-violet-900 text-xl"
      >
        <q-icon name="task" size="lg" />
        <p class="font-lg">{{ docx.name }}</p>
      </div>

      <q-card-actions
        class="flex space-x-6 items-center justify-center bg-white mb-2 p-0"
      >
        <q-btn
          flat
          label="Cancel"
          @click="
            () => {
              docx = null;
              fileSrc = '';
              filePreviewModal = false;
            }
          "
          class="text-red"
        />
        <q-btn
          flat
          label="Send"
          @click.prevent="
            () => {
              handleSend();
              filePreviewModal = false;
            }
          "
          class="text-green"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
//dependencies
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
//imports
import { db, storage } from '../boot/firebase';
import { v4 as uuid } from 'uuid';
import {
  getDownloadURL,
  ref as fireStorageRef,
  uploadBytesResumable,
} from 'firebase/storage';
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayRemove,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { date } from 'quasar';
import * as timeago from 'timeago.js';
import { scroll } from 'quasar';

import { useRouter } from 'vue-router';

import { useUserStore } from 'src/stores/userStore';
import { useChatStore } from 'src/stores/chatStore';

import { storeToRefs } from 'pinia';

const router = useRouter();

const userStore = useUserStore();
const chatStore = useChatStore();
const { currentChat } = storeToRefs(userStore);

//lifecycle hooks
const route = useRoute();

watch(currentChat, () => {
  // scrollToBottom()
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

//uplaod doc
const fileSrc = ref<any>('');
const uploadFileRef = ref<HTMLDivElement | null>();
const docx = ref<any>();
const filePreviewModal = ref<boolean>(false);

function getFile(e: Event) {
  if (e.target) {
    uploadFileRef.value?.click();
  }
}

const uploadFile = async (e: any) => {
  docx.value = e.target.files[0];

  if (docx.value) {
    filePreviewModal.value = true;
    fileSrc.value = URL.createObjectURL(e.target.files[0]);
  } else {
    fileSrc.value = '';
  }
};

const chatId: any = route.params.combinedUserId;
const friendId: any = chatId.replace(userStore.user.uid, '');
//send msg
const handleSend = async () => {
  try {
    if (file.value && !newMessage.value && !docx.value) {
      const storageRef = fireStorageRef(storage, `${uuid()}`);

      const uploadTask = uploadBytesResumable(storageRef, file.value);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        async () => {
          const docRef = doc(db, 'chats', chatId as string);
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(docRef, {
                messages: arrayUnion({
                  id: uuid(),
                  text: newMessage.value,
                  senderId: userStore.user.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                  file: '',
                }),
              });

              await updateDoc(doc(db, 'userChats', userStore.user.uid), {
                [chatId + '.lastMessage']: {
                  text: newMessage.value,
                  img: downloadURL,
                  file: '',
                },
                [chatId + '.date']: serverTimestamp(),
              });

              await updateDoc(doc(db, 'userChats', friendId), {
                [chatId + '.lastMessage']: {
                  text: newMessage.value,
                  img: downloadURL,
                  file: '',
                },
                [chatId + '.date']: serverTimestamp(),
              });
            }
          );
          docx.value = null;
          newMessage.value = '';
          file.value = null;
        }
      );
    } else if (!file.value && newMessage.value && !docx.value) {
      await updateDoc(doc(db, 'chats', chatId as string), {
        messages: arrayUnion({
          id: uuid(),
          text: newMessage.value,
          senderId: userStore.user.uid,
          date: Timestamp.now(),
          img: '',
          file: '',
        }),
      });

      await updateDoc(doc(db, 'userChats', userStore.user.uid), {
        [chatId + '.lastMessage']: {
          text: newMessage.value,
          img: '',
          file: '',
        },
        [chatId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'userChats', friendId), {
        [chatId + '.lastMessage']: {
          text: newMessage.value,
          img: '',
          file: '',
        },
        [chatId + '.date']: serverTimestamp(),
      });
      docx.value = null;
      newMessage.value = '';
      file.value = null;
    } else if (file.value && newMessage.value && !docx.value) {
      const storageRef = fireStorageRef(storage, `${uuid()}`);

      const uploadTask = uploadBytesResumable(storageRef, file.value);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        async () => {
          const docRef = doc(db, 'chats', chatId as string);
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(docRef, {
                messages: arrayUnion({
                  id: uuid(),
                  text: newMessage.value,
                  senderId: userStore.user.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                  file: '',
                }),
              });

              await updateDoc(doc(db, 'userChats', userStore.user.uid), {
                [chatId + '.lastMessage']: {
                  text: newMessage.value,
                  img: downloadURL,
                  file: '',
                },
                [chatId + '.date']: serverTimestamp(),
              });

              await updateDoc(doc(db, 'userChats', friendId), {
                [chatId + '.lastMessage']: {
                  text: newMessage.value,
                  img: downloadURL,
                  file: '',
                },
                [chatId + '.date']: serverTimestamp(),
              });
            }
          );
          docx.value = null;
          newMessage.value = '';
          file.value = null;
        }
      );
    } else if (file.value && newMessage.value && docx.value) {
      const storageRef = fireStorageRef(storage, `${uuid()}`);

      const uploadTask = uploadBytesResumable(storageRef, file.value);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        async () => {
          const docRef = doc(db, 'chats', chatId as string);
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(docRef, {
                messages: arrayUnion({
                  id: uuid(),
                  text: newMessage.value,
                  senderId: userStore.user.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                  file: '',
                }),
              });

              await updateDoc(doc(db, 'userChats', userStore.user.uid), {
                [chatId + '.lastMessage']: {
                  text: newMessage.value,
                  img: downloadURL,
                  file: '',
                },
                [chatId + '.date']: serverTimestamp(),
              });

              await updateDoc(doc(db, 'userChats', friendId), {
                [chatId + '.lastMessage']: {
                  text: newMessage.value,
                  img: downloadURL,
                  file: '',
                },
                [chatId + '.date']: serverTimestamp(),
              });
            }
          );
          docx.value = null;
          newMessage.value = '';
          file.value = null;
        }
      );

      const uploadTask2 = uploadBytesResumable(storageRef, docx.value);

      uploadTask2.on(
        (error) => {
          //TODO:Handle Error
        },
        async () => {
          const docRef = doc(db, 'chats', chatId as string);
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (docxDownloadURL: string) => {
              await updateDoc(docRef, {
                messages: arrayUnion({
                  id: uuid(),
                  text: newMessage.value,
                  senderId: userStore.user.uid,
                  date: Timestamp.now(),
                  img: '',
                  file: docxDownloadURL,
                }),
              });
              await updateDoc(doc(db, 'userChats', userStore.user.uid), {
                [chatId + '.lastMessage']: {
                  text: newMessage.value,
                  img: '',
                  file: docxDownloadURL,
                },
                [chatId + '.date']: serverTimestamp(),
              });

              await updateDoc(doc(db, 'userChats', friendId), {
                [chatId + '.lastMessage']: {
                  text: newMessage.value,
                  img: '',
                  file: docxDownloadURL,
                },
                [chatId + '.date']: serverTimestamp(),
              });
            }
          );
          docx.value = null;
          newMessage.value = '';
          file.value = null;
        }
      );
    }
  } catch (err: any) {
    const errString: string = err.toString();
    if (errString.includes('No document to update')) {
      alert('User has deleted his account');
    }
  }

  scrollToBottom();
};

const scroller = ref<HTMLDivElement | undefined | null>();
const pageChat = ref();

function scrollToBottom() {
  // Get parent DomNode that handles page scrolling
  // Usually this is element with classname ".layout-view" or "window"
  // console.log(getScrollTarget(DomElement)) // returns a DOM Element (or window Object)
  setTimeout(() => {
    window.scrollTo(0, pageChat?.value?.scrollHeight);
  }, 20);
}

async function goToSnap(msg: any) {
  if (msg.snapMessage || userStore.user.uid == msg.senderId) {
    return;
  } else {
    chatStore?.setCurrentCamPicURL(msg.snap);
    chatStore?.setCurrentSnapToDelete(msg);
    router.replace('/newSnap');
  }
}

onMounted(() => {
  onSnapshot(doc(db, 'chats', chatId), (doc) => {
    userStore.setCurrentChat(doc.data()?.messages);
  });

  scrollToBottom()

});
</script>

<style scoped></style>
