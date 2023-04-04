<script setup lang="ts">
//dependencies
import { ref } from 'vue';
import { useRouter } from 'vue-router';

//imports firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage, db } from '../boot/firebase';
import {
  ref as refStorage,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';


//other imports
import { $toast } from '../utils/notification';
import { getLocation } from '../utils/map';

const router = useRouter();

//vars
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const isPwd = ref(true);

const loading = ref(false);
const coords = ref();

//function
function submitHandler() {
  // we set loading state
  loading.value = true;

  const date = new Date().getTime();
  const displayName = firstName.value + lastName.value;

  // simulate a delay
  setTimeout(async () => {
    // we're done, we reset loading state
    loading.value = false;
    // alert('successfully registered');
    // router.replace('/');

    try {
      //create user
      const res = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

      //create unique pic name
      const storageRef = refStorage(storage, `${displayName + date}.jpg`);

      const uploadTask = uploadBytesResumable(storageRef, file.value);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case 'paused':
              break;
            case 'running':
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log('error uploading coz:', error);
          $toast('Error Uploading Image', 'error', 'top');
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            //update profile
            await updateProfile(res.user, {
              displayName: displayName,
              photoURL: downloadURL,
            });

            coords.value = await getLocation();

            //create user on firestore
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName: displayName,
              email: email.value,
              photoURL: downloadURL,
              location:coords.value,
              online:true,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, 'userChats', res.user.uid), {});
            router.replace('/');
          });
        }
      );
    } catch (error) {
      console.log(error);
      $toast('Error Registering User', 'error', 'top');
      // ..
    }
  }, 2000);
}

//img upload
const imageSrc = ref<any>('');
const clickimage = ref<HTMLDivElement | null>();
const file = ref<any>();

function clickImage(e: Event) {
  if (e.target) {
    clickimage.value?.click();
  }
}

const createImage = async (e: any) => {
  file.value = e.target.files[0];
  if (file.value) {
    imageSrc.value = URL.createObjectURL(e.target.files[0]);
  } else {
    imageSrc.value = '';
  }
};
</script>

<template>
  <div class="p-4 flex flex-col items-center space-y-8">
    <div class="text-h4">CHAT APP LOGO</div>
    <div class="text-h6">Register Now</div>
    <form class="flex flex-col items-center space-y-4 w-10/12">
      <div class="flex space-x-4 items-center">
        <q-input
          outlined
          standout
          rounded
          v-model="firstName"
          label="First Name"
          class="w-[47%]"
        >
        </q-input
        ><q-input
          outlined
          standout
          rounded
          v-model="lastName"
          label="Last Name"
          class="w-[47%]"
        >
        </q-input>
      </div>
      <q-input
        outlined
        standout
        rounded
        v-model="email"
        label="Email"
        class="w-full"
      >
      </q-input>

      <q-input
        v-model="password"
        label="Password"
        class="w-full"
        standout
        rounded
        outlined
        :type="isPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <form
        class="w-full flex flex-col space-y-1 items-center justify-center"
        @submit.prevent=""
      >
        <div class="h-20 w-20 bg-slate-200 rounded-lg relative">
          <!-- <Spinner
            :size="'spinner-lg'"
            :color="'green-spin'"
            v-if="loading"
            class="absolute top-36 left-40"
          /> -->
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
        <div class="flex flex-col w-full items-center">
          <button
            @click="clickImage"
            name="clickimage"
            class="bg-blue-600 rounded-lg h-6 w-24 text-xs text-white p-1"
          >
            Upload Avatar
          </button>
          <input
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
        </div>
      </form>

      <q-btn
        :loading="loading"
        color="secondary"
        class="glossy w-1/2 absolute bottom-20"
        rounded
        @click="submitHandler"
        label="Sign Up"
      />

      <p class="text-gray-700 absolute bottom-10">
        Already have an account ?
        <router-link
          to="/login"
          class="border-b-[1px] border-gray-800 pb-[0.1rem] font-bold text-gray-800"
        >
          Login
        </router-link>
      </p>
    </form>
  </div>
</template>
