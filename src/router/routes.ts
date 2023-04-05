import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('src/pages/loginPage.vue'),
  },

  {
    name: 'Register',
    path: '/register',
    component: () => import('src/pages/registerPage.vue'),
  },

  {
    name: 'Index',
    path: '/',
    component: () => import('src/pages/indexPage.vue'),
  },

  {
    name: 'Chat',
    path: '/chat/:combinedUserId',
    component: () => import('src/pages/chatPage.vue'),
  },

  {
    name: 'Capture',
    path: '/capture',
    component: () => import('src/pages/captureImage.vue'),
  },

  {
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'Chats',
        path: '/dashboard',
        component: () => import('pages/chatsPage.vue'),
      },

      {
        name: 'Map',
        path: '/map',
        component: () => import('src/pages/mapPage.vue'),
      },

      {
        name: 'Camera',
        path: '/camera',
        component: () => import('src/pages/cameraPage.vue'),
      },
      {
        name: 'Profile',
        path: '/profile',
        component: () => import('src/pages/profilePage.vue'),
      },
      {
        name: 'Settings',
        path: '/settings',
        component: () => import('src/pages/settingsPage.vue'),
      },

      {
        name: 'About Us',
        path: '/aboutUs',
        component: () => import('src/pages/aboutUs.vue'),
      },

      {
        name: 'Help',
        path: '/helpSupport',
        component: () => import('src/pages/helpSupport.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
