/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import {
  precacheAndRoute,
  PrecacheFallbackPlugin,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  // PrecacheController,
  // getCachedURLs,
} from 'workbox-precaching';
import {
  registerRoute,
  NavigationRoute,
  setCatchHandler,
} from 'workbox-routing';
import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { ExpirationPlugin } from 'workbox-expiration';
import {
  NetworkFirst,
  // CacheFirst,
  StaleWhileRevalidate,
  NetworkOnly,
  CacheFirst,
} from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

// Get a list of all the URLs currently cached
// new PrecacheController.getCachedURLs().then((urls:any) => {
//   console.log('Cached URLs:', urls);
// });

setCacheNameDetails({ prefix: 'SnipChat' });

cleanupOutdatedCaches();

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
    )
  );
}

// /**
//  * The workboxSW.precacheAndRoute() method efficiently caches and responds to
//  * requests for URLs in the manifest.
//  */
// self.__precacheManifest = [].concat(self.__precacheManifest || []);
// precacheAndRoute(self.__precacheManifest, {});

// Use cache first strategy for assets
registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|css|js)$/,
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

registerRoute(
  /^(https?:\/\/)?firestore\.googleapis\.com$/,
  new StaleWhileRevalidate({
    cacheName: 'firebase-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
      }),
    ],
  })
);

// This can be any strategy, CacheFirst used as an example.
const strategy = new CacheFirst();
const urls = ['/offline.html'];

warmStrategyCache({ urls, strategy });

// setCatchHandler((event: any) => {
//   // Fallback to the offline page for navigation requests.
//   if (event.request.mode === 'navigate') {
//     return caches.match('/offline.html');
//   }
//   return Response.error();
// });

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    plugins: [
      new PrecacheFallbackPlugin({
        fallbackURL: '/offline.html',
      }),
    ],
  })
);

// offlineFallback();

// registerRoute(
//   /https:\/\/rickandmortyapi\.com\/api\/character\/avatar\/(.+)\.(?:jpeg|jpg)/,
//   new StaleWhileRevalidate({
//     cacheName: 'avatar-cache',
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 20,
//         maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
//       }),
//     ],
//   })
// );
