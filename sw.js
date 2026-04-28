// SW.js - Cleared to resolve 500 errors and cache issues
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', (event) => {
    // Direct network fetch, no caching
    event.respondWith(fetch(event.request));
});
