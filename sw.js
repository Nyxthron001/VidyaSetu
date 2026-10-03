// Service Worker for VidyaSetu offline-first caching
const CACHE_NAME = 'vidyasetu-v1';

const STATIC_ASSETS = [
  '/',
  '/vidyasetu.html',
  '/styles.css',
  '/js/data.js',
  '/js/i18n.js',
  '/js/state.js',
  '/js/screens.js',
  '/js/router.js',
  '/assets/logo-small.png',
  '/assets/logo-medium.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(e.request).then((cached) =>
        cached || fetch(e.request).then((res) => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached)
      )
    )
  );
});
