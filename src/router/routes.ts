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
        name: 'Index',
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },

      {
        name: 'Map',
        path: '/pageOne',
        component: () => import('src/pages/pageOne.vue'),
      },

      {
        name: 'Camera',
        path: '/pageTwo',
        component: () => import('src/pages/pageTwo.vue'),
      },

      {
        name: 'Chats',
        path: '/pageThree',
        component: () => import('src/pages/pageThree.vue'),
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
