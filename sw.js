const CACHE_NAME = 'fire-gym-v10'; // رقم إصدار عالي لكسر القديم تماماً
const assets = ['./', './index.html', './manifest.json'];

// التثبيت
self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(assets)));
});

// التفعيل وحذف الكاش القديم
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(ks => {
        return Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    }));
    self.clients.claim();
});

// استراتيجية النتوورك أولاً (عشان التحديثات تظهر فوراً)
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
