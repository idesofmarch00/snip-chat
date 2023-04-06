<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="flex justify-center items-center">
          <router-link to="/dashboard" class="absolute left-6"
            ><q-icon name="arrow_back" round class=""
          /></router-link>
          <span class="text-xl">{{
            userStore.currentChatFriend[1].friendInfo.displayName
          }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-banner
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
    </q-banner>

    <!-- <div class="bg-red-50 max-h-[calc(100vh-20rem)] mt-12"></div> -->
    <q-page-container class="bg-red-50">
      <q-page ref="pageChat">
        <div class="px-4 column col justify-end">
          <q-chat-message
            :label="date.formatDate(Date.now(), 'ddd , Do MMM')"
          />
          <div v-for="(message, key) in currentChat" :key="key" class="mb-4">
            <q-chat-message
              ref="chatMessageeRef"
              :name="
                message.senderId == userStore.user.uid
                  ? 'Me'
                  : userStore.currentChatFriend[1].friendInfo.displayName
              "
              :sent="message.senderId == userStore.user.uid ? true : false"
              :bg-color="
                message.senderId == userStore.user.uid
                  ? 'light-blue-2'
                  : 'light-green-2'
              "
              :avatar="
                message.senderId == userStore.user.uid
                  ? userStore.user.photoURL
                  : userStore.currentChatFriend[1].friendInfo.photoURL
              "
            >
              <div class="flex flex-col space-y-2">
                <img :src="message.img" />
                {{ message.text }}
              </div>
            </q-chat-message>
            <span
              v-if="message.date"
              class="text-gray-800 font-bold text-[0.5rem]"
              :class="`${
                message.senderId == userStore.user.uid
                  ? 'absolute right-[3.8rem]'
                  : 'absolute left-[3.8rem]'
              }`"
              >{{ timeago.format(message?.date?.toDate().toISOString()) }}</span
            >
          </div>
        </div>
        <!-- place QPageScroller at end of page -->
        <q-page-scroller
          ref="scroller"
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
        class="w-full flex flex-col space-y-1 items-center justify-center text-black"
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
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { date } from 'quasar';
import * as timeago from 'timeago.js';

import { useUserStore } from 'src/stores/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { currentChat } = storeToRefs(userStore);

//lifecycle hooks
const route = useRoute();

const chatMessageRef = ref();
const pageChat = ref();

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
  if (file.value && !newMessage.value && !docx.value) {
    const storageRef = fireStorageRef(storage, `${uuid()}.jpg`);

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
    const storageRef = fireStorageRef(storage, `${uuid()}.jpg`);

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
    const storageRef = fireStorageRef(storage, `${uuid()}.jpg`);

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
};

onMounted(() => {
  const msg = onSnapshot(doc(db, 'chats', chatId), (doc) => {
    userStore.setCurrentChat(doc.data()?.messages);
  });
});
</script>

<style scoped></style>
