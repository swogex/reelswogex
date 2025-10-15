// ==================== Simple Service Worker ====================

// ==================== Install ====================
self.addEventListener("install", event => {
  console.log("✅ Service Worker installed");
  self.skipWaiting(); // Activate immediately
});

// ==================== Activate ====================
self.addEventListener("activate", event => {
  console.log("✅ Service Worker activated");
  self.clients.claim(); // Take control of pages immediately
});

// ==================== Fetch ====================
self.addEventListener("fetch", event => {
  // Only handle GET requests to the same origin
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Try network, fallback to offline page (optional)
  event.respondWith(
    fetch(event.request).catch(() => {
      // Optional: return offline page if request is navigation
      if (event.request.mode === "navigate") {
        return new Response(
          "<h1>Offline</h1><p>Check your internet connection.</p>",
          { headers: { "Content-Type": "text/html" } }
        );
      }
    })
  );
});
