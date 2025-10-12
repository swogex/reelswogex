const CACHE_NAME = 'bhabhi-reels-cache-v1';
const urlsToCache = [
  '/',
  '/assets/css/global.css',
  '/assets/css/header.css',
  '/assets/css/footer.css',
  '/assets/css/home.css',
  '/assets/css/reels.css',
  '/assets/css/menu.css',
  '/assets/js/bhabhi-app.js',
  '/assets/js/menu.js',
  '/assets/img/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => Promise.all(
      keyList.map(key => key !== CACHE_NAME && caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/videos')) {
    return; // bypass video API requests
  }
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
