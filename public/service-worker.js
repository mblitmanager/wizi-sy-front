// Incrémenter la version purge les anciens caches à l'activation.
const VERSION = 'v2';
const STATIC_CACHE = `wizi-learn-static-${VERSION}`;
const RUNTIME_CACHE = `wizi-learn-runtime-${VERSION}`;

// Fichiers indispensables au démarrage hors connexion
const PRECACHE = ['/', '/index.html', '/offline.html', '/manifest.json', '/favicon2.ico'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // API, médias et services tiers : jamais interceptés (données toujours fraîches)
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  // Pages : réseau d'abord pour toujours servir la dernière version déployée
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Fichiers de build hashés : immuables, le cache suffit
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Autres fichiers statiques (images, icônes...) : cache immédiat + mise à jour en arrière-plan
  event.respondWith(staleWhileRevalidate(request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put('/index.html', response.clone());
    }
    return response;
  } catch {
    return (await caches.match('/index.html')) || (await caches.match('/offline.html'));
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached || new Response('Ressource indisponible hors connexion', { status: 503 }));
  return cached || network;
}

self.addEventListener('push', (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      console.error('Notification push illisible', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Notification', {
      body: payload.body || 'Vous avez reçu une notification.',
      icon: payload.icon || '/favicon2.ico',
      badge: payload.badge || '/favicon2.ico',
      data: payload.data || {},
    })
  );
});

function notificationUrl(data) {
  if (data.link) return data.link;
  if (data.type === 'quiz-available' && data.quizId) return `/quiz/${data.quizId}`;
  if (data.type === 'formation-update') return '/formations';
  if (data.type === 'quiz-completed') return '/quizzes';
  if (data.type === 'reward-earned') return '/profile';
  return '/';
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = notificationUrl(event.notification.data || {});

  // Réutilise un onglet de l'application déjà ouvert plutôt que d'en ouvrir un nouveau
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((w) => new URL(w.url).origin === self.location.origin);
      if (existing) {
        existing.focus();
        return existing.navigate(target);
      }
      return self.clients.openWindow(target);
    })
  );
});
