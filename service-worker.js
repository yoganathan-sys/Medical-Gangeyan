/* =====================================================
   SRI SIVA MEDICALS - SERVICE WORKER
   Version: v1.0.0
   Cache Strategy:
     - HTML/Navigation: Network-First (with cache fallback)
     - CSS/JS/Assets: Stale-While-Revalidate
     - External/WhatsApp/Maps: Network-Only (bypass cache)
===================================================== */

const CACHE_NAME = 'sri-siva-medicals-v1';

// Static assets for offline availability
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './shop.html',
    './style.css',
    './script.js',
    './manifest.json',
    './images/image.png',
    './images/gangeyan.png',
    './images/owner.png',
    './images/icon-192.png',
    './images/icon-512.png',
    './images/shop-2.jpeg',
    './images/shop-3.jpeg',
    './images/shop-4.jpeg',
    './images/shop-5.jpeg',
    './images/shop-6.jpeg'
];

/* -----------------------------------------------------
   INSTALL EVENT
   Pre-cache essential shell assets & skip waiting
----------------------------------------------------- */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => {
                console.warn('[SW] Pre-caching warning:', err);
            })
    );
});

/* -----------------------------------------------------
   ACTIVATE EVENT
   Purge outdated cache versions & claim clients
----------------------------------------------------- */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

/* -----------------------------------------------------
   FETCH EVENT
   Safe caching strategies avoiding stale code
----------------------------------------------------- */
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Only process GET requests
    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    // Bypass external requests (WhatsApp, Google Maps, CDNs, etc.)
    if (url.origin !== self.location.origin) {
        return;
    }

    // Never cache WhatsApp endpoints or external messaging
    if (url.href.includes('wa.me') || url.href.includes('whatsapp.com')) {
        return;
    }

    // 1. HTML / Navigation requests: Network-First (ensures fresh content)
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fallback to cached index.html
                    return caches.match('./index.html');
                })
        );
        return;
    }

    // 2. Static Assets (CSS, JS, Images, Manifest): Stale-While-Revalidate
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Network failed, nothing to do if already serving from cache
                });

            return cachedResponse || fetchPromise;
        })
    );
});
