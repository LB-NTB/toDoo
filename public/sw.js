//'use strict';

// #####################################################################
// #                                                                   #
// #  Caching Mechanismus - Eigene Dateien Cachen                      #
// #                                                                   #
// #####################################################################

const cacheName = 'toDoo';

// Cache our known resources during install 
/*self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll([
        //'index.html', 
        //'sw.js',
        //offlineUrl
    ])) 
  ); 
});

// Service Worker aktiviert sich selbst, ohne Reload
self.addEventListener('activate', event => {
  clients.claim(); 
});*/


// #####################################################################
// #                                                                   #
// #  Network Request Intercepton - Save Data                          #
// #                                                                   #
// #####################################################################

// Don't serve google fonts
/*this.addEventListener('fetch', function (event) { 
  if(event.request.headers.get('save-data')){ 
    // We want to save data, so restrict icons and fonts 
    if (event.request.url.includes('fonts.googleapis.com')) { 
      // return nothing 
      event.respondWith(new Response('', {status: 417, statusText: 'Ignore fonts' })); 
    } 
  } 
});*/


// #####################################################################
// #                                                                   #
// #  Offline Strategie - Offline Seite anzeigen                       #
// #                                                                   #
// #####################################################################

const offlineUrl = 'offline-page.html';

// Offline-Seite wird aus dem Cache geladen
/*this.addEventListener('fetch', event => {
  if(event.request.method ==='GET' && 
    event.request.headers.get('accept').includes('text/html')){ 
      event.respondWith(fetch(event.request.url).catch(error => { 
          return caches.match(offlineUrl); 
      }))
  } 
  else { 
    event.respondWith(fetch(event.request)); 
  }
});

// *** Cache first pattern ***
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(function (response) { 
    
    // Ressource ist im Cache vorhanden -> zurückgeben
    if (response) { 
      return response; 
    } 

    var fetchRequest = event.request.clone();

    // Ressource ist nicht im Cache vorhanden -> an Server weiterleiten
    return fetch(fetchRequest).then(function (response) { 
      if (!response || response.status !== 200) { 
        return response; 
      }

      // Antwort des Servers kopieren und im Cache speichern
      var responseToCache = response.clone(); 
      caches.open(cacheName).then(function (cache) { 
        cache.put(event.request, responseToCache); 
      });

      return response;

    // Wenn Ressource nicht angefordert werden kann -> Offline Seite anzeigen
    }).catch(error => {

      if (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html')) {
        return caches.match(offlineUrl);
      }

    });
  }));
});*/


// #####################################################################
// #                                                                   #
// #  Background Sync - idb-keyval DB                                  #
// #                                                                   #
// #####################################################################


importScripts('./js/idb-keyval.js');

self.addEventListener('sync', function(event) {
	if (event.tag === 'task') { 
		event.waitUntil(
	  	idbKeyval.get('createItem').then(value =>
			   fetch('/create', {
			     method:  'POST', 
			     headers: new Headers ({'content-type': 'application/json' }), 
			     body:    JSON.stringify(value)
			   })
        // .then(response => response.json())
        // .then(response => {
        //   console.log("Antwort des Servers: " + response); 
        // })
        //.then(displayMessageNotification('Message sent')) 
        //.catch((err) => displayMessageNotification('Message failed'))
        .then(console.log('Pendenz an Server gesendet'))
        .then(idbKeyval.delete('createItem'))
      ) // ende kdbKeyval
    );  // ende waitUntil
	}

  
});
