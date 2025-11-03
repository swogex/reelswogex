// ==================== Simple Service Worker (schoolgirl Video) ====================

// ==================== Install ====================
self.addEventListener("install", event => {
  console.log("✅ schoolgirl Video Service Worker installed");
  self.skipWaiting();
});

// ==================== Activate ====================
self.addEventListener("activate", event => {
  console.log("✅ schoolgirl Video Service Worker activated");
  self.clients.claim();
});

// ==================== Fetch ====================
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === "navigate") {
        return new Response(
          "<h1>Offline</h1><p>Check your internet connection.</p>",
          { headers: { "Content-Type": "text/html" } }
        );
      }
    })
  );
});
