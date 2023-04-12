const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  '/index.html',
];

// cache size limit function
const limitCacheSize = (name:any, size:any) :any=> {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', (evt:any) => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', (evt:any) => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', (evt:any) => {
  if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then((cacheRes) => {
          return (
            cacheRes ||
            fetch(evt.request).then((fetchRes) => {
              return caches.open(dynamicCacheName).then((cache) => {
                cache.put(evt.request.url, fetchRes.clone());
                // check cached items size
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(() => {
          if (evt.request.url.indexOf('.vue') > -1) {
            return caches.match('/pages/offlinePage.vue');
          }
        })
    );
  }
});


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
//  if (request.mode === 'navigate'){
//   console.log('req set catch:',request)
//     return matchPrecache(offline)
//   }
//   return Response.error();
// });

