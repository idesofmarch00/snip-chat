<script setup lang="ts">
//dependencies
import { ref, onMounted, nextTick } from 'vue';

//services
import { useUserStore } from '../stores/userStore';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../boot/firebase';

//imports

const userStore = useUserStore();

const first_name = ref<string>('');
const last_name = ref<string>('');
const phoneNo = ref<string>('');
const dense = ref<boolean>(false);
const email = ref<string>('');
const loading = ref<boolean>(true);
const disabled = ref<boolean>(true);
const isEmailVerified = ref<boolean>(true);
const url = ref();
const img = ref();

const btnLoader = ref<boolean>(false);

onMounted(async () => {
  const res = await getDoc(doc(db, 'users', userStore.user?.uid));

  first_name.value = res?.data()?.firstName as string;
  last_name.value = res?.data()?.lastName as string;
  // phoneNo.value = res?.data()?.phoneNo as string;
  email.value = res?.data()?.email as string;
  img.value = res?.data()?.photoURL as string;

  loading.value = false;
});

const updateProfile = async () => {
  btnLoader.value = true;
  console.log('updated');
  disabled.value = true;
  btnLoader.value = true;
};

function handleUpload(e: any) {
  const file = e.target.files[0];
  if (file) {
    loading.value = true;
    setTimeout(() => {
      url.value = URL.createObjectURL(file);
      loading.value = false;
    }, 1500);
  } else {
    loading.value = false;
  }
  nextTick(() => {
    handleSubmit();
  });
}

function handleSubmit() {
  img.value = true;
  emit('pushURL', url.value);
}
const emit = defineEmits(['pushURL', 'url.value']);

//end-of-script
</script>

<template>
  <div>
    <div
      v-if="!loading"
      class="h-[calc(100vh-80px)] flex flex-col items-center px-4 space-y-8 relative py-1 md:border md:h-11/12 pt-4"
    >
      <q-avatar size="100px" font-size="52px"><img :src="img" /></q-avatar>
      <q-input
        outlined
        v-model="first_name"
        :placeholder="first_name"
        label="First Name"
        disable
        readonly
        stack-label
        :dense="dense"
        class="w-full self-start"
      /><q-input
        outlined
        v-model="last_name"
        :placeholder="last_name"
        label="Last Name"
        disable
        readonly
        stack-label
        :dense="dense"
        class="w-full self-start"
      /><q-input
        outlined
        v-model="email"
        :placeholder="email"
        label="Email"
        disable
        readonly
        stack-label
        :dense="dense"
        class="w-full self-start"
      />

      <div class="mt-4 self-start">
        <button
          v-if="disabled"
          @click="disabled = false"
          class="w-28 rounded-lg bg-teal-500 font-bold p-2 text-white"
        >
          Edit profile
        </button>
        <div v-else class="flex items-center gap-x-3">
          <button @click="updateProfile" class="w-28 btn btn-blue font-bold">
            Update
          </button>
          <button @click="disabled = true" class="w-28 btn btn-red font-bold">
            Cancel
          </button>
        </div>
      </div>
    </div>
    <div v-else class="h-[calc(100vh-150px)] container-center justify-center">
      <Spinner :color="'green-spin'" :size="'spinner-lg'" />
    </div>
  </div>
</template>

<style scoped></style>
