/* Send It service worker — v37

   Two bugs in the old one are fixed here.

   1. It was cache-first for EVERYTHING, including index.html. Once a phone had v20
      cached it kept serving v20 forever, because the only thing that could replace
      index.html was a cache miss, and there never was one. New builds landed on the
      server and never reached the phone. The app shell is now network-first with a
      cache fallback, so a new version arrives on the next launch with signal, and
      the app still opens fine with no signal at all.

   2. Any failed request fell back to index.html. A map tile that failed therefore
      came back as a page of HTML, which the tile parser choked on. Non-navigation
      requests now fail cleanly instead of being handed a document.
*/
const CACHE = 'si-v37';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});

function isShell(url) {
  if (url.origin !== self.location.origin) return false;
  const base = self.location.pathname.replace(/[^/]*$/, '');
  const rel = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname;
  return rel === '' || rel === 'index.html' || rel === 'manifest.webmanifest';
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }

  // Map tiles and anything else cross-origin: straight to the network, never cached,
  // and a failure is a real failure. Never hand back an HTML page.
  if (url.origin !== self.location.origin) return;

  // App shell and navigations: network-first so updates actually arrive.
  if (req.mode === 'navigate' || isShell(url)) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // Icons and other same-origin static files: cache-first, they rarely change.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
