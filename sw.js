// ==================== Service Worker ====================
const CACHE_NAME = "swogex-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/assets/css/global.css",
  "/assets/css/header.css",
  "/assets/css/footer.css",
  "/assets/css/home.css",
  "/assets/css/reels.css",
  "/assets/css/menu.css",
  "/assets/js/app.js",
  "/assets/js/menu.js",
  "/assets/img/logo.png",
  "/assets/icons/home.png",
  "/assets/icons/search.png",
  "/assets/icons/saved.png",
  "/assets/icons/login.png",
  "/assets/icons/video.png"
];

// ==================== Install ====================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// ==================== Activate ====================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// ==================== Fetch ====================
self.addEventListener("fetch", event => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      // Always try network first
      return fetch(event.request)
        .then(response => {
          // If invalid or opaque response, return directly (don’t cache)
          if (!response || response.status !== 200 || response.type === "opaque") {
            return cached || response;
          }

          // Clone once for caching
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // If offline and cached available → serve it
          if (cached) return cached;
          // Optional fallback page
          if (event.request.destination === "document") {
            return caches.match("/");
          }
        });
    })
  );
});
