const CACHE_NAME = "site-cache-v1";

// ✅ Yeh files install time par cache me store ho jayengi
const ASSETS_TO_CACHE = [
  "/", // homepage
  "/index.html",
  "assets/css/global.css",
  "assets/css/header.css",
  "assets/css/footer.css",
  "assets/css/home.css",
  "assets/css/reels.css",
  "/assets/js/app.js",
  "/assets/images/logo.png",
];

// ===== INSTALL EVENT =====
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching static assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");

  // Purane cache delete karna (agar version badla)
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// ===== FETCH EVENT =====
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Response clone karke cache update kar do
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => {
        // Agar network fail ho gaya, cache se return karo
        return caches.match(event.request).then((res) => {
          if (res) return res;
          // Agar cache bhi nahi mile, fallback response
          return new Response("⚠️ Offline: Resource not available.", {
            status: 404,
            headers: { "Content-Type": "text/plain" },
          });
        });
      })
  );
});
