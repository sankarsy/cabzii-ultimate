/* Cabzii service worker — lightweight offline support.
 * Strategy:
 *  - Navigations: network-first with an offline fallback.
 *  - Static assets (_next/static, images, fonts): stale-while-revalidate.
 *  - Never caches API, admin, auth or payment responses.
 */
const VERSION = "v2";
const STATIC_CACHE = `cabzii-static-${VERSION}`;
const PAGE_CACHE = `cabzii-pages-${VERSION}`;
const OFFLINE_URL = "/";

const NEVER_CACHE = ["/api/", "/admin", "/payment", "/login", "/signin", "/my-bookings", "/booking"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.add(OFFLINE_URL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function isNeverCache(pathname) {
  return NEVER_CACHE.some((p) => pathname === p || pathname.startsWith(`${p}`));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isNeverCache(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/images") ||
    url.pathname.startsWith("/icon") ||
    /\.(?:js|css|woff2?|png|jpg|jpeg|webp|avif|svg|gif)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((response) => {
              if (response && response.status === 200) cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
