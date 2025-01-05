const CACHE_NAME = 'meditation-app-v1';
const urlsToCache = [
    './', // Cache the root
    './index.html',
    './css/index.css',
    './js/index.js',
    './cordova.js',
    './img/logo.png' // Add other static assets as needed
];

// Install the Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch cached files when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// Activate the Service Worker and remove old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});