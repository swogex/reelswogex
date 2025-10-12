// ==================== Bhabhi Reels Service Worker ====================
const CACHE_NAME = "bhabhi-reels-v1";
const ASSETS = [
  "/",
  "/bhabhireel.html",
  "/assets/css/global.css",
  "/assets/css/reels.css",
  "/assets/js/bhabhi-app.js",
  "/assets/js/menu.js",
  "/assets/icons/home.png",
  "/assets/icons/video.png",
  "/assets/icons/like.png",
  "/assets/icons/comment.png",
  "/assets/icons/share.png",
  "/assets/icons/speaker-off.png",
  "/assets/icons/speaker-on.png"
];

// ==================== INSTALL ====================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ==================== ACTIVATE ====================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ==================== FETCH ====================
self.addEventListener("fetch", event => {
  // ❌ Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Try network first
      return fetch(event.request)
        .then(networkResponse => {
          // Only cache valid responses (status 200)
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback to cache
          if (cachedResponse) return cachedResponse;
          // Optional: fallback to home page
          if (event.request.destination === "document") {
            return caches.match("/bhabhireel.html");
          }
        });
    })
  );
});
