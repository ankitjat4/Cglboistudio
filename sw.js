/* ==========================================================================
   SSC CGL INTELLIGENCE OS - OFFLINE-FIRST WEBAPK SERVICE WORKER (V8.0)
   Supports GitHub Pages subdirectory hosting & full offline IndexedDB operation
   ========================================================================== */

const CACHE_NAME = "cgl-os-webapk-v9.7.5";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./style.css?v=9.6",
  "./style.css?v=9.7",
  "./app.js",
  "./app.js?v=9.6",
  "./app.js?v=9.7",
  "./manifest.json",
  "./pwa-192x192.png",
  "./pwa-512x512.png",
  "./pwa-maskable-512x512.png",
  "./apple-touch-icon.png",
  "./icon.svg",
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of CORE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (_) {
          // Ignore non-critical CDN pre-fetch error during install
        }
      }
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Do not intercept external AI API calls (Gemini / Groq / OpenRouter)
  if (
    url.hostname.includes("generativelanguage.googleapis.com") ||
    url.hostname.includes("api.groq.com") ||
    url.hostname.includes("openrouter.ai")
  ) {
    return;
  }

  // Network-first for HTML/JS/CSS so updates on GitHub Pages propagate immediately when online,
  // with instant fallback to cache when offline!
  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200 && (url.origin === self.location.origin || url.hostname.includes("cdnjs.cloudflare.com"))) {
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return networkRes;
      })
      .catch(async () => {
        const cached = await caches.match(req, { ignoreSearch: false }) || await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;
        if (req.mode === "navigate") {
          return caches.match("./index.html");
        }
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});
