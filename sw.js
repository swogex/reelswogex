// ==================== Service Worker ====================
const CACHE_NAME = 'swogex-cache-v1';
const urlsToCache = [
  '/',
  '/assets/css/global.css',
  '/assets/css/header.css',
  '/assets/css/footer.css',
  '/assets/css/home.css',
  '/assets/css/reels.css',
  '/assets/css/menu.css',
  '/assets/js/app.js',
  '/assets/js/menu.js',
  '/assets/img/logo.png',
  '/assets/icons/home.png',
  '/assets/icons/search.png',
  '/assets/icons/saved.png',
  '/assets/icons/login.png',
  '/assets/icons/video.png'
];

// ==================== Install Event ====================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// ==================== Activate Event ====================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
});

// ==================== Fetch Event ====================
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // ⚠️ Only cache GET requests
        if (event.request.method === "GET") {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          // Optional fallback page or image if request not cached
          if (event.request.destination === 'document') return caches.match('/');
        });
      })
  );
});
