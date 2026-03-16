// ══════════════════════════════════════════
//  SERVICE WORKER — Natulac Censo
//  ⚠️ Cambia VERSION cada vez que publiques
//     una actualización para que los teléfonos
//     reciban el banner de "Actualizar"
// ══════════════════════════════════════════
const VERSION    = '1.2';
const CACHE_NAME = 'natulac-censo-' + VERSION;
const ASSETS     = ['./index.html', './manifest.json'];

// INSTALL — cachear archivos base
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // NO hacer skipWaiting aquí — esperar confirmación del usuario
});

// ACTIVATE — limpiar cachés viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH — servir desde caché, red como fallback
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (
    url.includes('script.google.com') ||
    url.includes('unpkg.com') ||
    url.includes('openstreetmap.org') ||
    url.includes('nominatim') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com') ||
    url.includes('natulac.com')
  ) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});

// MESSAGE — recibir orden de actualizar desde la app
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
