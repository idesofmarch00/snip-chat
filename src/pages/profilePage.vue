<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md q-gutter-md">
      <q-list bordered>
        <q-item>
          <q-item-section>
            <q-item-label>Username</q-item-label>
            <q-item-label caption>{{ user.username }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Email</q-item-label>
            <q-item-label caption>{{ user.email }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>First Name</q-item-label>
            <q-item-label caption>{{ user.firstName }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Last Name</q-item-label>
            <q-item-label caption>{{ user.lastName }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Bio</q-item-label>
            <q-item-label caption>{{ user.bio }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from "vue";

const user = ref({
  username: 'johndoe',
  email: 'johndoe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  bio: 'I am a software engineer who loves to code!',
});
</script>
