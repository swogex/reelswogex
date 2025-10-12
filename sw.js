const CACHE_NAME = "swogex-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "assets/css/global.css",
  "assets/css/header.css",
  "assets/css/footer.css",
  "assets/css/home.css",
  "/assets/css/animate.css",
  "/assets/js/app.js",
  "/assets/icons/like.png",
  "/assets/icons/comment.png",
  "/assets/icons/share.png",
  "/assets/icons/speaker-off.png",
  "/assets/icons/speaker-on.png",
];

// ===== INSTALL =====
self.addEventListener("install", (e) => {
  console.log("SW: Installed");
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// ===== ACTIVATE =====
self.addEventListener("activate", (e) => {
  console.log("SW: Activated");
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
    ))
  );
});

// ===== FETCH =====
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return resp;
      })
      .catch(() => caches.match(e.request).then(res => {
        if (res) return res;
        return new Response("⚠️ Offline: Resource not available.", {
          status: 404,
          headers: {"Content-Type": "text/plain"}
        });
      }))
  );
});
