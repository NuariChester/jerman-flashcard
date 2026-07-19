// Kita naikkan versinya ke v2 agar browser langsung tahu ada update web baru
const CACHE_NAME = 'deflash-v2';

// Menggunakan titik ('./') wajib hukumnya untuk GitHub Pages agar tidak error 404
const urlsToCache = [
  './',
  './index.html',
  './favicon.svg',
  './saweria.png',
  './manifest.json'
];

// 1. Install Service Worker & Simpan File ke Memori
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate: Hapus memori cache versi lama (v1) agar web selalu update!
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch: Ambil dari cache kalau offline, atau internet kalau online
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Gunakan versi offline jika ada di cache
        }
        return fetch(event.request);
      })
  );
});
