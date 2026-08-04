const STONEBRIDGE_IMAGE_CACHE = 'stonebridge-pexels-images-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.hostname !== 'images.pexels.com') {
    return;
  }

  event.respondWith(
    caches.open(STONEBRIDGE_IMAGE_CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      return response;
    })
  );
});
