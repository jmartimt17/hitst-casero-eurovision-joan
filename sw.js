const CACHE = 'hitster-v7';
const ASSETS = [
  './',
  './play.html',
  './cards.html',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js'
];
const PRECACHE = new Set(ASSETS.map(a => new URL(a, self.registration.scope).href));

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Solo servimos de caché los assets del propio juego.
// Deezer / iTunes / api externas pasan siempre a la red.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!PRECACHE.has(e.request.url)) return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
