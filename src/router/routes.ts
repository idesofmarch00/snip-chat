import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/pageOne',
        component: () => import('src/pages/pageOne.vue'),
      },
      {
        path: '/pageTwo',
        component: () => import('src/pages/pageTwo.vue'),
      },
      {
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
