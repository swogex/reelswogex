// ==================== Bhabhi Service Worker ====================
const CACHE_NAME = "bhabhi-reels-cache-v1";
const ASSETS_TO_CACHE = [
  "/", 
  "/assets/css/global.css",
  "/assets/css/header.css",
  "/assets/css/footer.css",
  "/assets/css/home.css",
  "/assets/css/reels.css",
  "/assets/css/menu.css",
  "/assets/js/bhabhi-app.js",
  "/assets/js/menu.js",
  "/assets/icons/home.png",
  "/assets/icons/search.png",
  "/assets/icons/saved.png",
  "/assets/icons/login.png",
  "/assets/icons/video.png",
  "/assets/icons/like.png",
  "/assets/icons/comment.png",
  "/assets/icons/share.png",
  "/assets/icons/speaker-off.png",
  "/assets/icons/speaker-on.png",
];

// ==================== Install Event ====================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// ==================== Activate Event ====================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ==================== Fetch Event ====================
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResp => {
      if (cachedResp) return cachedResp;

      return fetch(event.request)
        .then(networkResp => {
          // clone the response before caching
          const responseClone = networkResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return networkResp;
        })
        .catch(() => {
          // fallback if network fails
          if (event.request.destination === "document") return caches.match("/");
        });
    })
  );
});
