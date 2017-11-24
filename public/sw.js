"use strict";

var cacheName = 'toDoo';

// Cache our known resources during install 
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll([
        //'index.html', 
        'sw.js' 
    ])) 
  ); 
});

// SW aktiviert sich selbst, ohne Reload
self.addEventListener('activate', event => {
  clients.claim(); 
});


/* Beispie aus Buch:
self.addEventListener('activate', function(event) { 
  event.waitUntil(self.clients.claim()); });
*/

// Cache any new resources as they are fetched
self.addEventListener('fetch', event => { 
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }) 
    .then(function(response) { 
      if (response) {
        return response;
      } 

      var requestToCache = event.request.clone();

      return fetch(requestToCache)
      .then(function(response) { 
        if(!response || response.status !== 200) { 
          return response; 
        }

        var responseToCache = response.clone(); 

        caches.open(cacheName) 
        .then(function(cache) {
          cache.put(requestToCache, responseToCache); 
        });

        return response; 
      });

    }) 
  ); 
});

 
// Network Request Interception
/*self.addEventListener('fetch', function(event) { 
  if (/\.jpg$/.test(event.request.url)) { 
    event.respondWith( 
      new Response('<p>This is a response that comes from your service worker!</p>', { 
        headers: { 'Content-Type': 'text/html' } 
      });
    ); 
  }
});*/

