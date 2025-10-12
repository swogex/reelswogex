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
  "/assets/icons/speaker-on.png",
];

// Install
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
          return res;
        })
        .catch(() => caches.match("/"));
    })
  );
});
