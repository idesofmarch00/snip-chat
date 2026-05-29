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
          <q-btn
            v-if="hasNotificationSupport && notificationPermission !== 'granted'"
            @click="requestNotificationPermission"
            flat
            round
            dense
            color="yellow-4"
            icon="notifications_paused"
            class="absolute right-6"
          >
            <q-tooltip>Enable Notifications</q-tooltip>
          </q-btn>
          <q-btn
            v-else-if="hasNotificationSupport"
            flat
            round
            dense
            color="green-4"
            icon="notifications_active"
            class="absolute right-6"
          >
            <q-tooltip>Notifications Active</q-tooltip>
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-banner
      v-if="!isOnline"
      class="bg-red-5 text-white text-center font-bold text-base sticky top-[50px] z-20"
      inline-actions
    >
      <template v-slot:avatar>
        <q-icon name="wifi_off" color="white" />
      </template>
      You are currently offline. Messages will sync in the background when connection is restored.
    </q-banner>

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
          <div v-for="(message, key) in allMessages" :key="key" class="mb-6">
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
                message.isFailed
                  ? 'red-2'
                  : message.isOfflinePending
                    ? 'grey-4'
                    : message.senderId == userStore.user.uid
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
                <span class="">{{ message.text }}</span>
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
              v-if="message.isFailed"
              class="font-medium text-[0.65rem] text-red-5 flex items-center cursor-pointer"
              :class="`${
                message.senderId == userStore.user.uid
                  ? 'absolute right-[3.8rem]'
                  : 'absolute left-[3.8rem]'
              }`"
              @click.prevent="retrySendMessage(message)"
            >
              <q-icon name="error" class="mr-1 text-red-5" />
              <span>Failed to send - Tap to retry</span>
            </span>
            <span
              v-else-if="message.isOfflinePending"
              class="font-medium text-[0.65rem] text-gray-500 flex items-center"
              :class="`${
                message.senderId == userStore.user.uid
                  ? 'absolute right-[3.8rem]'
                  : 'absolute left-[3.8rem]'
              }`"
            >
              <q-icon name="sync" class="animate-spin mr-1 text-orange-5" />
              <span>Pending Sync</span>
            </span>
            <span
              v-else-if="message.date && !message.snap"
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
              :bg-color="$q.dark.isActive ? 'gray-700  ' : 'teal-50'"
              class="text-lg font-semibold"
              :class="$q.dark.isActive ? 'text-white ' : 'text-black'"
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
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
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
import { date, scroll, useQuasar } from 'quasar';
import * as timeago from 'timeago.js';

import { useRouter } from 'vue-router';

import { useUserStore } from 'src/stores/userStore';
import { useChatStore } from 'src/stores/chatStore';

import { storeToRefs } from 'pinia';

const router = useRouter();
const $q = useQuasar();

const userStore = useUserStore();
const chatStore = useChatStore();
const { currentChat } = storeToRefs(userStore);

// Network and Sync state
const isOnline = ref(navigator.onLine);
const offlineMessagesList = ref<any[]>([]);

// Notification state
const hasNotificationSupport = ref(typeof window !== 'undefined' && 'Notification' in window);
const notificationPermission = ref(typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default');

async function requestNotificationPermission() {
  if (hasNotificationSupport.value) {
    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;
  }
}

function showBrowserNotification(body: string, senderName: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`New Message from ${senderName}`, {
      body: body,
      icon: '/icons/icon-128x128.png',
      badge: '/icons/icon-128x128.png',
    });
  }
}

// IndexedDB local storage helpers for offline messages
function getDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('snip-chat-db', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('offline-messages')) {
        db.createObjectStore('offline-messages', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveOfflineMessage(msg: any) {
  const db = await getDB();
  const tx = db.transaction('offline-messages', 'readwrite');
  await new Promise<void>((resolve, reject) => {
    const req = tx.objectStore('offline-messages').put(msg);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function getOfflineMessages() {
  const db = await getDB();
  const tx = db.transaction('offline-messages', 'readonly');
  return new Promise<any[]>((resolve, reject) => {
    const req = tx.objectStore('offline-messages').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function clearOfflineMessages() {
  const db = await getDB();
  const tx = db.transaction('offline-messages', 'readwrite');
  await new Promise<void>((resolve, reject) => {
    const req = tx.objectStore('offline-messages').clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function deleteOfflineMessage(id: string) {
  const db = await getDB();
  const tx = db.transaction('offline-messages', 'readwrite');
  await new Promise<void>((resolve, reject) => {
    const req = tx.objectStore('offline-messages').delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function loadOfflineMessages() {
  offlineMessagesList.value = await getOfflineMessages();
}

async function handleServiceWorkerMessage(event: MessageEvent) {
  if (event.data && event.data.type === 'SYNC_MESSAGES') {
    await syncOfflineMessages();
  }
}

async function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
  if (isOnline.value) {
    await syncOfflineMessages();
  }
}

async function syncOfflineMessages() {
  const offlineMsgs = await getOfflineMessages();
  if (offlineMsgs.length === 0) return;

  for (const msg of offlineMsgs) {
    try {
      await updateDoc(doc(db, 'chats', chatId as string), {
        messages: arrayUnion({
          id: msg.id,
          text: msg.text,
          senderId: msg.senderId,
          date: Timestamp.now(),
          img: '',
          file: '',
        }),
      });

      await updateDoc(doc(db, 'userChats', userStore.user.uid), {
        [chatId + '.lastMessage']: {
          text: msg.text,
          img: '',
          file: '',
        },
        [chatId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'userChats', friendId), {
        [chatId + '.lastMessage']: {
          text: msg.text,
          img: '',
          file: '',
        },
        [chatId + '.date']: serverTimestamp(),
      });

      // Successfully synced! Delete from IndexedDB.
      await deleteOfflineMessage(msg.id);
    } catch (err) {
      console.error('Failed to sync offline message:', msg.id, err);
      // Mark as failed and update in IndexedDB
      msg.isFailed = true;
      await saveOfflineMessage(msg);
    }
  }

  // Reload the offline messages list from IndexedDB to refresh UI state
  await loadOfflineMessages();
}

async function retrySendMessage(msg: any) {
  // Clear the failed state
  msg.isFailed = false;
  await saveOfflineMessage(msg);
  await loadOfflineMessages();

  if (isOnline.value) {
    await syncOfflineMessages();
  } else {
    $q.notify({
      type: 'warning',
      message: 'Still offline. Message remains queued.',
      position: 'top',
    });
  }
}

const allMessages = computed(() => {
  const merged = [...(currentChat.value || [])];
  for (const offlineMsg of offlineMessagesList.value) {
    if (!merged.find(m => m.id === offlineMsg.id)) {
      merged.push({
        ...offlineMsg,
        isOfflinePending: !offlineMsg.isFailed,
        isFailed: !!offlineMsg.isFailed
      });
    }
  }
  return merged;
});

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
    if (!isOnline.value) {
      if (!newMessage.value.trim()) return;
      const msgId = uuid();
      const offlineMsg = {
        id: msgId,
        text: newMessage.value,
        senderId: userStore.user.uid,
        date: new Date(),
        img: '',
        file: '',
      };

      await saveOfflineMessage(offlineMsg);
      offlineMessagesList.value.push(offlineMsg);
      newMessage.value = '';

      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
          const reg = await navigator.serviceWorker.ready;
          await reg.sync.register('sync-messages');
        } catch (err) {
          console.warn('Sync registration failed:', err);
        }
      }
      scrollToBottom();
      return;
    }

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
  if (msg.isFailed) {
    await retrySendMessage(msg);
    return;
  }
  if (msg.snapMessage || userStore.user.uid == msg.senderId) {
    return;
  } else {
    chatStore?.setCurrentCamPicURL(msg.snap);
    chatStore?.setCurrentSnapToDelete(msg);
    router.replace('/newSnap');
  }
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
  }

  loadOfflineMessages();

  if (hasNotificationSupport.value && notificationPermission.value === 'default') {
    requestNotificationPermission();
  }

  onSnapshot(doc(db, 'chats', chatId), (docSnap) => {
    const messages = docSnap.data()?.messages || [];
    if (userStore.currentChat && messages.length > userStore.currentChat.length) {
      const newMsg = messages[messages.length - 1];
      if (newMsg.senderId !== userStore.user.uid) {
        if (document.hidden) {
          showBrowserNotification(newMsg.text || 'Sent a message', userStore.currentChatFriend[1].friendInfo.userName);
        }
      }
    }
    userStore.setCurrentChat(messages);
  });

  scrollToBottom();
});

onBeforeUnmount(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);

  if ('serviceWorker' in navigator) {
    navigator.removeEventListener('message', handleServiceWorkerMessage);
  }
});
</script>

<style scoped></style>
