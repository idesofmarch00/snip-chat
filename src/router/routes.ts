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
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'Chats',
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },

      {
        name: 'Camera',
        path: '/camera',
        component: () => import('src/pages/cameraPage.vue'),
      },

      {
        name: 'Map',
        path: '/map',
        component: () => import('src/pages/mapPage.vue'),
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
