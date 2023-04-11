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
  matchPrecache,
  // PrecacheController,
  // getCachedURLs,
} from 'workbox-precaching';
import {
  registerRoute,
  NavigationRoute,
  setCatchHandler,
} from 'workbox-routing';
import { warmStrategyCache } from 'workbox-recipes';
import { ExpirationPlugin } from 'workbox-expiration';
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
  NetworkOnly,
} from 'workbox-strategies';
import {
  CacheableResponsePlugin,
} from 'workbox-cacheable-response';

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST,);

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
  new CacheFirst({
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

// registerRoute(
//   ({ request }) => request.mode === 'navigate',
//   new NetworkOnly({
//     plugins: [
//       new PrecacheFallbackPlugin({
//         fallbackURL: '/offline.html',
//       }),
//     ],
//   })
// );


// Fallback assets to cache
// const FALLBACK_HTML_URL = '/offline.html';
// const FALLBACK_STRATEGY = new CacheFirst();
// // Warm the runtime cache with a list of asset URLs
// warmStrategyCache({
//   urls: [FALLBACK_HTML_URL],
//   strategy: FALLBACK_STRATEGY,
// });


// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
// setCatchHandler(async ({request}) => {
//   // Fallback assets are precached when the service worker is installed, and are
//   // served in the event of an error below. Use `event`, `request`, and `url` to
//   // figure out how to respond, or use request.destination to match requests for
//   // specific resource types.
//   switch (request.destination) {
//     case 'document':
//       // FALLBACK_HTML_URL must be defined as a precached URL for this to work:
//       return matchPrecache(FALLBACK_HTML_URL);

//     default:
//       // If we don't have a fallback, return an error response.
//       return Response.error();
//   }
// });

// Fallback to offline.html
// setCatchHandler(({ request }) => {
//   if (request.destination === 'document') {
//     return caches.match('/offline.html');
//   }
//   return Response.error();
// });



