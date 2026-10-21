var CACHE = "farkle-v1";

function assetUrl(path) {
  return new URL(path, self.registration.scope).href;
}

function assetList() {
  return [assetUrl("./"), assetUrl("index.html"), assetUrl("farkle.js"), assetUrl("i18n.js"), assetUrl("sw.js")];
}

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(assetList());
  }));
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key !== CACHE;
    }).map(function (key) {
      return caches.delete(key);
    }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  if (request.cache === "reload") {
    event.respondWith(fetch(request));
    return;
  }
  event.respondWith(caches.match(request).then(function (cached) {
    if (cached) return cached;
    if (request.mode === "navigate") {
      return caches.match(assetUrl("index.html")).then(function (index) {
        return index || fetch(request);
      });
    }
    return fetch(request);
  }));
});
