<template>
  <form
    class="w-full flex flex-col h-[calc(100vh)] space-y-1 items-center justify-center"
    @submit.prevent=""
  >
    <div class="h-full w-full bg-white rounded-lg relative flex flex-col items-center">
      <!-- <Spinner
            :size="'spinner-lg'"
            :color="'green-spin'"
            v-if="loading"
            class="absolute top-36 left-40"
          /> -->
      <q-icon
        name="arrow_back"
        @click="goBack"
        class="absolute w-8 h-8 top-2 left-2 bg-gray-600 text-white text-md border rounded-full container-center justify-center"
      >
      </q-icon>
      <img
        v-show="imageSrc"
        :src="imageSrc"
        alt="totalizer"
        class="rounded-lg h-full w-full"
      />
      <q-icon
      size="lg"
        name="camera"
        round
        @click="clickImage"
        class="rounded-lg text-xs text-black p-1 z-100 absolute bottom-2"
      />
    </div>
    <div class="flex flex-col w-full items-center">
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '../stores/chatStore';
import { useRouter } from 'vue-router';

const chatStore = useChatStore();
const router = useRouter();

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
    chatStore.setCurrentCamPic(imageSrc.value);
    chatStore.setCurrentCamPicURL(file.value);
    router.replace('/preview')
  } else {
    imageSrc.value = '';
  }
};

function goBack() {
  file.value = null;
  imageSrc.value = '';
  router.replace('/dashboard');
}
</script>
