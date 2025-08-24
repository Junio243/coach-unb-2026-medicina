const CACHE_NAME = 'coach-unb-cache-v2'; // Version bump to clear old cache
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// On install, cache the static assets that make up the app shell.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// On activation, remove any old caches to prevent conflicts.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// The fetch event handler determines how to respond to requests.
self.addEventListener('fetch', event => {
  // For navigation requests (loading the actual page), use a cache-first strategy.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
    return;
  }

  // For all other requests (scripts, styles, API calls), use a network-first strategy.
  // This is crucial to ensure the latest code is always served when online.
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // If the network request is successful, clone it and cache it for offline use.
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      })
      .catch(() => {
        // If the network request fails (e.g., offline), serve the response from the cache.
        return caches.match(event.request);
      })
  );
});
