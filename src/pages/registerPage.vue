<script setup lang="ts">
//dependencies
import { ref,onBeforeMount } from 'vue';
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
const userName = ref('');
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

  // simulate a delay
  setTimeout(async () => {
    // we're done, we reset loading state
    // alert('successfully registered');
    // router.replace('/');

    try {
      //create user
      const res = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
       console.log('user',res)
      //create unique pic name
      const storageRef = refStorage(storage, `${userName.value + date}.jpg`);

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
    loading.value = false;

        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            //update profile
            await updateProfile(res.user, {
              displayName: userName.value,
              photoURL: downloadURL,
            });

            coords.value = await getLocation();

         try {
             //create user on firestore
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              userName: userName.value,
              firstName:firstName.value,
              lastName:lastName.value,
              email: email.value,
              photoURL: downloadURL,
              location:coords.value,
              // online:true,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, 'userChats', res.user.uid), {});
            router.replace('/');
         } catch (e) {
          throw new Error("error creating user on firestore",{cause:e});
    loading.value = false;

          
         }
          });
        }
      );
    } catch (error) {
      console.log(error);
      $toast('Error Registering User', 'error', 'top');
    loading.value = false;

      // ..
    }
    $toast('User Registerd', 'success', 'top');
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

onBeforeMount(() => {
  if (localStorage.getItem('user')==='true'){
    router.replace('/dashboard')
  }
});

function signUpWithGoogle(){
  return;
}
</script>

<template>
  <div class="p-4 flex flex-col items-center space-y-6">
     
      <!-- <div class="text-h4">
        <img src="../assets/favicon.png" class="h-40 w-40" />
      </div> -->
      <div class="text-h6 -mb-2">Register Now</div>
    <form class="flex flex-col items-center space-y-4 w-10/12">
      <div class="flex space-x-4 items-center">
        <q-input
          outlined
          standout
          v-model="firstName"
          label="First Name"
          class="w-[47%]"
        >
        </q-input
        ><q-input
          outlined
          standout
          v-model="lastName"
          label="Last Name"
          class="w-[47%]"
        >
        </q-input>
      </div>
      <q-input
        outlined
        standout
        v-model="userName"
        label="Username"
        class="w-full"
      >
      </q-input>
      <q-input
        outlined
        standout
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
        class="glossy w-full"
        @click="submitHandler"
        label="Sign Up"
      />

       <p class="text-gray-700">
        Already have an account ?
        <router-link
          to="/login"
          class="border-b-[1px] border-red-800 pb-[0.1rem] font-bold text-red-600"
        >
          Login
        </router-link>
      </p>
      <div
        class="flex items-center justify-center flex-col w-full h-full"
      >
        <p class="text-gray-600 mb-4">or</p>
        <div class="flex flex-col items-center space-y-1">

            <div
              class="rounded flex items-center h-12 w-52 google-blue text-gray-100 hover:text-white shadow font-bold text-sm "
              @click.prevent="signUpWithGoogle"
            >
              <div class="bg-white h-12 w-12 mr-2 flex items-center justify-center">
              <img src="../assets/google.png" class="h-8 w-8"/>
              </div> 
              <div class="pl-3 ">Sign up with Google</div>
            </div>

            <!-- <div
              class="bg-gray-900 text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer w-64 mt-2"
            >
              <svg
                viewBox="0 0 24 24"
                class="fill-current mr-3 w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
              <span class="border-l border-gray-800 h-6 w-1 block mr-1"></span>
              <span class="pl-3">Sign up with Github</span>
            </div>

            <div
              class="bg-indigo-600 text-gray-100 hover:text-white shadow text-sm font-bold py-3 px-4 rounded flex justify-start items-center cursor-pointer w-64 mt-2"
            >
              <svg
                viewBox="0 0 24 24"
                class="fill-current mr-3 w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z"
                />
              </svg>
              <span
                class="border-l border-indigo-500 h-6 w-1 block mr-1"
              ></span>
              <span class="pl-3">Sign up with Facebook</span>
            </div>-->
          </div> 
      </div>


     
    </form>
  </div>
</template>

<style scoped>
.google-blue {
  background: #4285f4;
}</style>
