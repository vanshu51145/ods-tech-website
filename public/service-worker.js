const CACHE_NAME = "ods-network-v2";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/favicon.svg",
  "/icons.svg",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName !== CACHE_NAME
          )
          .map((cacheName) =>
            caches.delete(cacheName)
          )
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (cachedResponse) => {

        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request);

      }
    )
  );
});