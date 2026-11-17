// 오프라인에서도 앱이 열리도록 화면 파일을 보관한다.
// 인터넷이 되면 항상 새 버전을 먼저 받고, 안 될 때만 보관본을 쓴다.
const CACHE = 'naso-v5';
const FILES = [
  './', 'index.html', 'app.js', 'web-backend.js', 'styles.css', 'glacier.css', 'mac.css', 'web.css',
  'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(c =>
      fetch(e.request, { cache: 'no-cache' })
        .then(r => { if (r.ok) c.put(e.request, r.clone()); return r; })
        .catch(() => c.match(e.request, { ignoreSearch: true }).then(hit => hit || Response.error()))
    )
  );
});
