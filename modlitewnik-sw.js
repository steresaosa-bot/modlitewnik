const CACHE_NAME = 'modlitewnik-v2';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  'angelus.md',
  'aniol.md',
  'boze.md',
  'coz.md',
  'cześć.md',
  'gwiazdo.md',
  'hostii.md',
  'idźmy.md',
  'aniolpa.md',
  'konaj.md',
  'jezujezu.md',
  'klaniam.md',
  'koch.md',
  'Krolowej.md',
  'kto.md',
  'matko.md',
  'opanie.md',
  'ostworzycielu.md',
  'pan.md',
  'panie.md',
  'pod.md',
  'pojdz.md',
  'prez.md',
  'przybadz.md',
  'serdeczna matko.md',
  'skryty.md',
  'uczyńcie.md',
  'udrzwi.md',
  'ukrytego.md',
  'weź.md',
  'witam.md',
  'wszystko.md',
  'Z dawna Polski Tyś Królową.md',
  'zblizam.md',
  'zdrowaś.md',
  'zrobcie.md',
  'chlebie.md',
  'dzieki.md',
  'nad.md',
  'niech.md',
  'oto.md',
  'paniemoj.md',
  'pie.md',
  'poz.md',
  'przy.md',
  'wej.md',
  'witaj.md',
  'wode.md',
  'wspan.md'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    if (url.pathname.toLowerCase().endsWith('.md')) {
  event.respondWith((async () => {
    try {
      const response = await fetch(req, { cache: 'no-store' });
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, response.clone()).catch(() => {});
      return response;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
  return;
}
    event.respondWith((async () => {
      if (req.mode === 'navigate') {
        try {
          const networkResponse = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, networkResponse.clone()).catch(() => {});
          return networkResponse;
        } catch (err) {
          const cached = await caches.match('./index.html');
          if (cached) return cached;
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        }
      }

      try {
        const cached = await caches.match(req);
        if (cached) return cached;
        const response = await fetch(req);
        caches.open(CACHE_NAME).then(cache => cache.put(req, response.clone())).catch(() => {});
        return response;
      } catch (err) {
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })());
  }
});
