/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["index.html","a4dbba08a6c88a17a83a00605de1d954"],["indexDrive.html","c4801f08c680296c810b60411d01c1d9"],["indexGeo.html","05f9fc2f43bc34e3e486cff1fbce2e5d"],["indexSidebar.html","2b32214b0dcc9af10216909b3745cda0"],["indexSync.html","47843cae10846b027e933c80ab19255a"],["indexUI.html","18936219b122c0fc324c825b0d3f0ec0"],["links.txt","f38f3db02e69fdc3231bd5337a8c5c25"],["manifest.json","6e4b732c7fa38ed2fa74527b6f325d05"],["resources/css/category-tiles.css","0e35c8ad390113282ad905d8dd0bdc3f"],["resources/css/glyphicon-util.css","c26e1cb8caa24955b8a2e765927bc021"],["resources/css/loadingSpinner.css","25756fcc80a5b59e1f2a902425e05f81"],["resources/css/page-map.css","92ed1fd0aeb389f30dfb2563cafda868"],["resources/css/page.css","a1706f705097ed1949dfa76800019057"],["resources/css/sidebar.css","91336eb92e3c410442e84848c11267a6"],["resources/images/icon.ico","a2f3014421105f7a991a1748a0d0cb58"],["resources/images/icon_128x128.png","f720b37b13709e01dcfdb6ea7287e6e1"],["resources/images/icon_16x16.png","f945c726561a7fac97e3c31dde8ac124"],["resources/images/icon_24x24.png","f1afbab55ee18dbd51be4a4aab12b52a"],["resources/images/icon_256x256.png","4ea6a9c3d55491dfcf0ae4aa345b2fbd"],["resources/images/icon_32x32.png","aca7b8151e2bf714cd607b2359d26a83"],["resources/images/icon_48x48.png","2989758a590310020ed972c9d140b6de"],["resources/images/icon_64x64.png","a26ecc965ab9e7b01ab27d32719f1946"],["resources/images/icon_96x96.png","6a0e2d53e9b6d5f6c94fc0fa4de4319c"],["resources/js/GeoLocation.js","45f3fc82aae4c4566605276e37d0ca42"],["resources/js/GoogleDrive.js","fd5b7095e8b3b026c5522ee1f6cce272"],["resources/js/GoogleSignin.js","e7696da3bec92d3ae1195be394888628"],["resources/js/Messages.js","3b7ea9daec078a639c68ebce2b30fcc6"],["resources/js/Parameters.js","1a47b0d3dd5028de74e4bc0182fc512e"],["resources/js/SyncTools.js","5fae26aa6f492b145cc84b4624de33ae"],["resources/js/Trip.js","7c75f4185eb4f56a16d9919beee22279"],["resources/js/Util.js","c36ca4a2edba4925c4a99ef611e749b1"],["resources/js/ViewModel/FilterViewModel.js","7e02eff1c6aaeefcf5a392c96bcfb3a3"],["resources/js/ViewModel/TripViewModel.js","157a427a84a8b6b7d53235e3e1e93700"],["resources/js/controller/addLocation.js","475abcbd410d4a2b1e654bfe08a80c75"],["resources/js/controller/editLocation.js","a4e7c3a38a834361ddefbf25068d1ecb"],["resources/js/controller/imagePreview.js","ba932d8c1c748a9146cd2db3d7a8b1a4"],["resources/js/controller/locationList.js","b21b8595ac879c5f20b9869f436aae43"],["resources/js/controller/map.js","4825a8be85c578aee31bf01f49789cb1"],["resources/js/controller/preferences.js","ebb932c5260fa1c196799e62a33f5f62"],["resources/js/controller/previewPanels.js","38176829948d51491a43cfb227020346"],["resources/js/controller/sidebar.js","af92fde4949c46e516d5dd5b06dad3a6"],["resources/js/controller/viewLocation.js","97b3e8e8f490da81288a0db92ce2290d"],["resources/js/ko-leaflet.js","bb772592d23cb706cb681cf9444242ce"],["resources/js/main.js","cf60fac9f4f5f17deebdf108d36420bd"],["resources/js/repository/TripModel.js","0ddfbda2216a642c13ff2e94e63d98b7"],["sw copy.js","00dcac6d039bcc895dfb786deacaa1ab"],["sw.js","00dcac6d039bcc895dfb786deacaa1ab"],["test/sync.html","36d46c48bd23b64ec59ef8e00e5b03ad"],["test/trip.html","7a6d47dc35c261fd9f6202f055aa2298"],["test/tripModel.html","91f521ba504e411125b455ae59b57a51"],["test/tripViewModel.html","473542df86b1a0fd6ca0604c6902f327"],["vendors/Google/api.js","3f5286079b00652c0e954bfde7231e97"],["vendors/LeafletPulsingIcon/L.Icon.Pulse.min.css","9c240a6c9d7419e48f755ad27b370b17"],["vendors/LeafletPulsingIcon/L.Icon.Pulse.min.js","8b6261262bd000912324148d2a2b2632"],["vendors/bootstrap-material/bootstrap-material-design.min.css","2e672801251628c5ec561cbab804648d"],["vendors/bootstrap-material/material.min.js","ffcf87341c4bea3538cc689481807c62"],["vendors/bootstrap-material/ripples.min.css","f4002a1682b839fa41fd7c5a09a28713"],["vendors/bootstrap-material/ripples.min.js","de8142542ed4c233e41a1976b9dbaafc"],["vendors/bootstrap/bootstrap.min.css","ec3bb52a00e176a7181d454dffaea219"],["vendors/bootstrap/bootstrap.min.js","5869c96cc8f19086aee625d670d741f9"],["vendors/fonts/glyphicons-halflings-regular.eot","f4769f9bdb7466be65088239c12046d1"],["vendors/fonts/glyphicons-halflings-regular.svg","89889688147bd7575d6327160d64e760"],["vendors/fonts/glyphicons-halflings-regular.ttf","e18bbf611f2a2e43afc071aa2f4e1512"],["vendors/fonts/glyphicons-halflings-regular.woff","fa2772327f55d8198301fdb8bcfc8158"],["vendors/fonts/glyphicons-halflings-regular.woff2","448c34a56d699c29117adc64c43affeb"],["vendors/fonts/material-icons/MaterialIcons-Regular.eot","e79bfd88537def476913f3ed52f4f4b3"],["vendors/fonts/material-icons/MaterialIcons-Regular.ijmap","ed6a98d002bc0b535dd8618f3ae05fe7"],["vendors/fonts/material-icons/MaterialIcons-Regular.svg","a1adea65594c502f9d9428f13ae210e1"],["vendors/fonts/material-icons/MaterialIcons-Regular.ttf","a37b0c01c0baf1888ca812cc0508f6e2"],["vendors/fonts/material-icons/MaterialIcons-Regular.woff","012cf6a10129e2275d79d6adac7f3b02"],["vendors/fonts/material-icons/MaterialIcons-Regular.woff2","570eb83859dc23dd0eec423a49e147fe"],["vendors/fonts/material-icons/material-icons.css","1186613246de1e97dff88de0dab7bdfd"],["vendors/fonts/roboto/roboto-v16-latin-300.eot","f83aa6d195038f0103ad63b728d46c35"],["vendors/fonts/roboto/roboto-v16-latin-300.svg","dd0bea1f9a808d633492fa573039ca1d"],["vendors/fonts/roboto/roboto-v16-latin-300.ttf","c254cb32fab6605176a501a26fde2079"],["vendors/fonts/roboto/roboto-v16-latin-300.woff","dc2e21898247b807422ac32ba45f58c6"],["vendors/fonts/roboto/roboto-v16-latin-300.woff2","68b24b48f11ff8e947976b529c6f5941"],["vendors/fonts/roboto/roboto-v16-latin-500.eot","713a6623ad820be635f48050f204b4d6"],["vendors/fonts/roboto/roboto-v16-latin-500.svg","95204ac95130828753c0ee0ada537c33"],["vendors/fonts/roboto/roboto-v16-latin-500.ttf","7a050a4856f9a3c67441ab09aa79e76f"],["vendors/fonts/roboto/roboto-v16-latin-500.woff","ac8381d5023c0187e7a094726d204f6e"],["vendors/fonts/roboto/roboto-v16-latin-500.woff2","4b218fc7ca179e548471ff37e3060081"],["vendors/fonts/roboto/roboto-v16-latin-700.eot","2b246a5540c3706485cc74b0066b9711"],["vendors/fonts/roboto/roboto-v16-latin-700.svg","57888be7f3e68a7050452ea3157cf4de"],["vendors/fonts/roboto/roboto-v16-latin-700.ttf","ac4b1fbb9377af314a935111f95c7c87"],["vendors/fonts/roboto/roboto-v16-latin-700.woff","89b469433216121ca9d12c1aef1353d1"],["vendors/fonts/roboto/roboto-v16-latin-700.woff2","aa3e87117db2b3c27801cbb8dfe40c6c"],["vendors/fonts/roboto/roboto-v16-latin-regular.eot","c3453f443cf8b548b6161300093c779b"],["vendors/fonts/roboto/roboto-v16-latin-regular.svg","8681f434273fd6a267b1a16a035c5f79"],["vendors/fonts/roboto/roboto-v16-latin-regular.ttf","f84c80506d15558a70e3c7752be22177"],["vendors/fonts/roboto/roboto-v16-latin-regular.woff","a9fc51fd0214c75ee5953dda0f2a06a6"],["vendors/fonts/roboto/roboto-v16-latin-regular.woff2","a2647ffe169bbbd94a3238020354c732"],["vendors/fonts/roboto/roboto.css","62e0ddb6e5910f381f0097eea7cb2e19"],["vendors/jquery/jquery-2.1.0.js","3177091fb9705dd978689ba11bf0609a"],["vendors/knockout/knockout-min.js","e956a74c005b7a243f0884d67e60f8f3"],["vendors/leaflet/images/layers-2x.png","4f0283c6ce28e888000e978e537a6a56"],["vendors/leaflet/images/layers.png","a6137456ed160d7606981aa57c559898"],["vendors/leaflet/images/marker-icon-2x.png","d95d69fa8a7dfe391399e22c0c45e203"],["vendors/leaflet/images/marker-icon.png","2273e3d8ad9264b7daa5bdbf8e6b47f8"],["vendors/leaflet/images/marker-shadow.png","44a526eed258222515aa21eaffd14a96"],["vendors/leaflet/leaflet-src.js","b1aadf426928ef49375fb5a9b856c213"],["vendors/leaflet/leaflet-src.map","3047330fdc6281fa76c55fda7316560f"],["vendors/leaflet/leaflet.css","f4dfd20f27bb4f93ff1d418c370c6de8"],["vendors/leaflet/leaflet.js","c107e28b6b0a61c76a371b73e7067bbf"],["vendors/localforage/localforage.min.js","04bbe882c627de0c0d294e1fa7d8ca8b"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







