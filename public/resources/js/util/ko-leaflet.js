/* Adapted from: https://github.com/giabos/ko-leaflet */


/* global ko, L, console */

(function(ko, L) {
  //"use strict";

  /**
   *       cfr https://github.com/pointhi/leaflet-color-markers
   *   Possible colors: blue, red, green, orange, yellow, violet, grey, black
   */
  function coloredMarkerIcon(color) {
    return new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' + color + '.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  var each = ko.utils.arrayForEach;

  // 'm' contains following observables: center (array containing [lat, lng]), draggable, title, text, opened (popup), color (see above)
  var Marker = function(m, map) {
    var self = this;

    self.eventHandlers = []; // array of objects: target, eventName, handler

    self.centerM = ko.computed({
      read: function() {
        return [ko.unwrap(m.center[0]), ko.unwrap(m.center[1])];
      },
      write: function(center) {
        m.center[0](center.lat);
        m.center[1](center.lng);
      }
    });

    var title = ko.isObservable(m.title) ? m.title : ko.observable(m.title);
    var text = ko.isObservable(m.text) ? m.text : ko.observable(m.text);

    var markerOptions = {
      draggable: ko.unwrap(m.draggable || false),
      opacity: ko.unwrap(m.opacity || 1.0)
    };

    if (!!title) {
      markerOptions.title = ko.unwrap(title || '----');
    }

    if (m.color) {
      markerOptions.icon = coloredMarkerIcon(m.color);
    } else if (m.icon) {
      markerOptions.icon = ko.unwrap(m.icon);
    }

    // Create marker in leaflet.
    self.marker = L.marker(ko.unwrap(self.centerM), markerOptions);
    self.marker.addTo(map);

    if (ko.unwrap(m.draggable || false)) {
      self.marker.on('dragend', function(evt) {
        self.eventHandlers.push({
          target: evt.target,
          eventName: evt.type,
          handler: arguments.callee
        });
        self.centerM(self.marker.getLatLng());
      });
    }

    self.subscriptions = [
      self.centerM.subscribe(function() {
        self.marker.setLatLng(ko.unwrap(self.centerM));
      })

    ];
    self.subscriptions.push(self.centerM);

    if (!!ko.unwrap(text)) {
      self.marker.bindPopup(ko.unwrap(text));

      var popup = self.marker.getPopup();
      self.subscriptions.push(title.subscribe(function() {
        self.marker.title = ko.unwrap(title);
      }));
      self.subscriptions.push(text.subscribe(function() {
        popup.setContent(ko.unwrap(text));
      }));
      if (m.opened && ko.isObservable(m.opened)) {
        self.subscriptions.push(m.opened.subscribe(function(o) {
          if (o) {
            self.marker.openPopup();
          } else {
            self.marker.closePopup();
          }
        }));
        self.marker.on('popupclose', function(evt) {
          m.opened(false);
        });
      }
    }

    if (m.opacity && ko.isObservable(m.opacity)) {
      self.subscriptions.push(m.opacity.subscribe(function(o) {
        self.marker.setOpacity(o);
      }));
    }

    this.map = map;
  };

  Marker.prototype.dispose = function() {
    // remove all events & subscriptions.
    each(this.eventHandlers, function(eh) {
      eh.target.removeEventListener(eh.eventName, eh.handler);
    });
    each(this.subscriptions, function(subscription) {
      subscription.dispose();
    });
    this.map.removeLayer(this.marker);
  };

  ko.bindingHandlers.leafletMap = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var controller = valueAccessor();
      var center = controller.center,
        zoom = controller.zoom || 10,
        markers = controller.markers,
        invalidateSize = controller.invalidateSize,
        eventHandlers = [], // array of objects: target, eventName, handler
        mapOptions = controller.mapOptions || {},
        centerMarker = controller.centerMarker,
        centerCircle = controller.centerCircle,
        customEventsHandlers = controller.events;

      var mapCenter = ko.computed({
        read: function() {
          return [ko.unwrap(center[0]), ko.unwrap(center[1])];
        },
        write: function(newCenter) {
          center[0](newCenter.lat);
          center[1](newCenter.lng);
        }
      }, null, {
        disposeWhenNodeIsRemoved: element
      });

      var map = L.map(element, ko.unwrap(mapOptions)).setView(ko.unwrap(mapCenter), ko.unwrap(zoom));

      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      var subscriptions = [
        mapCenter.subscribe(function() {
          map.setView(ko.unwrap(mapCenter));
        })
      ];
      map.on('dragend', function(evt) {
        eventHandlers.push({
          target: evt.target,
          eventName: evt.type,
          handler: arguments.callee
        });
        mapCenter(map.getCenter());
      });

      // Add all event listeners to the map by running through the keys of the object
      each(Object.keys(customEventsHandlers || {}), function(handlerName) {
        map.on(handlerName, customEventsHandlers[handlerName]);
      });

      // triggers an 'invalidateSize' when detecting a change in an observable (cfr http://stackoverflow.com/questions/20400713/leaflet-map-not-showing-properly-in-bootstrap-3-0-modal)
      if (invalidateSize && ko.isObservable(invalidateSize)) {
        subscriptions.push(invalidateSize.subscribe(function() {
          map.invalidateSize();
        }));
      }

      if (ko.isObservable(zoom)) {
        var subsc = zoom.subscribe(function() {
          map.setZoom(ko.unwrap(zoom));
        });
        subscriptions.push(subsc);
        map.on('zoomend', function(evt) {
          eventHandlers.push({
            target: evt.target,
            eventName: evt.type,
            handler: arguments.callee
          });
          zoom(map.getZoom());
        });
      }

      map.on('moveend', function(e) {
        controller.bounds(map.getBounds());
      });

      var markersList = [];
      each(ko.unwrap(markers), function(m, idx) {
        markersList.push(new Marker(m, map));
      });
      if (centerMarker) {
        var markerCenter = new Marker(ko.unwrap(centerMarker), map);

        var centerCircleObject = L.circle(markerCenter.centerM(), {
          fillColor: centerMarker.color,
          fillOpacity: 0.3,
          radius: centerCircle.radius(),
          weight: 0
        }).addTo(map);

        markerCenter.centerM.subscribe(function(newValue) {
          this.setLatLng(newValue);
        }, centerCircleObject);

        centerCircle.radius.subscribe(function(newValue) {
          this.setRadius(newValue);
        }, centerCircleObject);
      }
      // http://stackoverflow.com/questions/14149551/subscribe-to-observable-array-for-new-or-removed-entry-only
      var subscr = markers.subscribe(function(changes) {
        // processing deleted first so that the right elements are disposed
        // by processing add/delete simultaneously adding elements might overwrite an element that needs to be disposed of
        // afterwards, the list of delete items is removed from markersList, if there hasn't been an addition at that index
        // in that case the item is already replaced and thus removed
        each(changes, function(c){
          if (c.status === "deleted") {
            // sometimes we receive a delete status although the markersList is empty.
            if (c.index < markersList.length) {
              markersList[c.index].dispose();
            }
          }
        });
        var addedIndexes = [];
        each(changes, function(c) {
          if (c.status === "added") {
            markersList[c.index] = new Marker(c.value, map);
            addedIndexes.push(c.index);
          }
        });
        // delete after that all have been disposed otherwise cannot be accessed anymore via 'index'.
        each(changes.reverse(), function(c) {
          if ((c.status === "deleted") && (addedIndexes.indexOf(c.index) === -1)) {
            markersList.splice(c.index, 1);
          }
        });
      }, this, "arrayChange");
      subscriptions.push(subscr);

      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        // dispose all subscriptions & events.
        each(eventHandlers, function(eh) {
          eh.target.removeEventListener(eh.eventName, eh.handler);
        });
        each(markersList, function(m) {
          m.dispose();
        });
        each(subscriptions, function(subscription) {
          subscription.dispose();
        });
      });

    }
  };

})(ko, L);
