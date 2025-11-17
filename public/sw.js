// Service Worker for PathWordle PWA
const CACHE_NAME = "pathwordle-v1.0.0";

self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Let the browser handle all requests for now
  // We can add caching strategies later
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

console.log("[SW] Service Worker loaded");
