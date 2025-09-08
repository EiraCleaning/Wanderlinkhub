// Basic Service Worker for WanderLink Hub PWA
const CACHE_NAME = 'wanderlink-hub-v1';

// Install event - minimal caching for development
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker cache opened');
        return cache;
      })
  );
});

// Fetch event - minimal interference for development
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle specific app routes, let everything else pass through
  if (url.pathname === '/' || 
      url.pathname === '/explore' ||
      url.pathname === '/calendar' ||
      url.pathname === '/submit' ||
      url.pathname === '/profile') {
    
    // For these routes, try network first, fallback to cache
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
  
  // For all other requests (JS, CSS, API calls), don't interfere
  // This allows normal development server behavior
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 