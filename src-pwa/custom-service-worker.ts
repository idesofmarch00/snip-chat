/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

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

// Background Sync Listener
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(notifySyncMessages());
  }
});

async function notifySyncMessages() {
  const clientsList = await self.clients.matchAll({ type: 'window' });
  for (const client of clientsList) {
    client.postMessage({ type: 'SYNC_MESSAGES' });
  }
}

// Push Notification Listener
self.addEventListener('push', (event: any) => {
  let data = { title: 'New Message', body: 'You have a new message!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (err) {
      data = { title: 'New Message', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-128x128.png',
    badge: '/icons/icon-128x128.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Listener
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

