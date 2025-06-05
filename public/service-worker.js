// Cache Names
const CACHE_NAME = 'wizi-learn-cache-v1';
const DYNAMIC_CACHE = 'wizi-learn-dynamic-cache-v1';

// Vérification de la compatibilité
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isAndroid = /android/i.test(navigator.userAgent);

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/lovable-uploads/e4aa6740-d9f0-40d2-a150-efc75ae46692.png'
];

// Installation event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation');
  
  // Skip waiting to activate the service worker immediately
  self.skipWaiting();
  
  // Cache core assets
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activation event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[Service Worker] Removing old cache', name);
            return caches.delete(name);
          })
      );
    })
  );
  
  // Ensures the service worker takes control of the page immediately
  return self.clients.claim();
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  // Skip for non-GET requests or browser extensions
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith('http')) {
    return;
  }
  
  // Skip for API requests
  if (event.request.url.includes('/api/')) {
    return fetch(event.request);
  }

  // Gestion spéciale pour Safari
  if (isSafari) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Cache-first strategy pour les autres navigateurs
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, get from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the response for future
            if (networkResponse && networkResponse.status === 200) {
              const clonedResponse = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // If both cache and network fail, show a fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            // For other resources, fail gracefully
            return new Response('Ressource indisponible hors connexion', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Push notifications handler avec vérification de compatibilité
self.addEventListener('push', function(event) {
  // Vérifier si les notifications sont supportées
  if (!self.registration.showNotification) {
    console.log('Notifications non supportées');
    return;
  }

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: '/favicon.ico',
      tag: `notification-${data.id}`,
      requireInteraction: true,
      data: {
        id: data.id
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Gestion spéciale pour Android
  if (isAndroid) {
    event.waitUntil(
      clients.matchAll({type: 'window'}).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/notifications');
      })
    );
  } else {
    event.waitUntil(
      clients.openWindow('/notifications')
    );
  }
});
