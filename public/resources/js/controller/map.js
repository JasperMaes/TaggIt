var MapController = function(updateLocationGpsError, initLocationGpsError, tripViewModel, addLocationController, filterViewModel) {

  var watchId;
  var buttonsVisible = ko.observable(false);
  var centerMarker = {
    center: [ko.observable(50.81057), ko.observable(4.93622)],
    draggable: false,
    icon: L.icon.pulse({
      iconSize: [18, 18],
      color: '#2196F3'
    })
  };
  var markers = ko.observableArray([]);
  var center = [ko.observable(50.81057), ko.observable(4.93622)];
  var zoom = ko.observable(16);
  var centerCircle = {
    radius: ko.observable(0)
  };
  var mapVisible = ko.observable(false);
  var filterbarVisible = ko.observable(false);
  var isInitialized = ko.observable(false);
  var bounds = ko.observable();
  var events = {
    dragstart: function(evt) {
      if (watchId > 0) {
        GeoLocation.clearWatch(watchId);
        watchId = -1;
      }
    }
  };

  function addMarker(position, controller) {
    addLocationController.locationData.position = position;

    controller.showPage("addLocationView");
  }

  function updateCenterMarker(options) {
    centerMarker.center[0](options.lat);
    centerMarker.center[1](options.lng);
    centerCircle.radius((options.accuracy || 0) * 2);
  }

  function updateCenter(args) {
    var options = args || {};
    center[0](options.lat);
    center[1](options.lng);
    if (!!options.zoom) {
      zoom(options.zoom);
    }
    updateCenterMarker(options);
  }

  function initMap() {
    GeoLocation.get().then(function(position) {
      var pos = [position.coords.latitude, position.coords.longitude];
      var accuracy = position.coords.accuracy;
      var centerOptions = {
        lat: pos[0],
        lng: pos[1],
        zoom: 16,
        accuracy: (accuracy > 100 && accuracy < 400) ? accuracy : 0
      };
      updateCenter(centerOptions);
      buttonsVisible(true);
      mapVisible(true);
      filterbarVisible(true);
      isInitialized(true);
      watchId = GeoLocation.watch(updateMyLocationMarker, updateLocationGpsError);
    }).catch(function(error) {
      initLocationGpsError(error);
      window.setTimeout(initMap, 1000);
    });
  }

  function updateMyLocationMarker(position) {
    var accuracy = position.coords.accuracy;
    var centerOptions = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: (accuracy > 100 && accuracy < 400) ? accuracy : 0
    };
    updateCenter(centerOptions);

    buttonsVisible(true);
    mapVisible(true);
    filterbarVisible(true);
  }

  function addMarkerHandler(controller) {
    var lat = centerMarker.center[0]();
    var lng = centerMarker.center[1]();

    addMarker([lat, lng], controller);
  }

  function centerMapHandler() {
    // Update the location immediately with the current position of the center marker
    // It will also be updated when the watch method calls the callback but this can have some delay
    // Setting the postition immediately avoids this delay
    updateCenter({
      lat: centerMarker.center[0](),
      lng: centerMarker.center[1]()
    });
    if (watchId > 0) {
      GeoLocation.clearWatch(watchId);
      watchId = -1;
    }
    watchId = GeoLocation.watch(updateMyLocationMarker, updateLocationGpsError);
  }

  ko.computed(function() {
    var result = [];
    var trip = tripViewModel.currentTrip();
    if (!!trip) {
      trip.getAllFiltered().forEach(function(location) {
        var text = "";
        if (!!location.title && (location.title.length > 0)) {
          text = "<strong>" + Util.encodeHTML(location.title) + "</strong>";
        } else {
          text = "<strong>" + Util.encodeHTML("<No name>") + "</strong>";
        }
        if (location.description) {
          if (text.length > 0) {
            text += "<br>";
          }
          text += Util.encodeHTML(location.description);
        }
        result.push({
          center: [ko.observable(location.position[0]), ko.observable(location.position[1])],
          draggable: false,
          opened: ko.observable(false),
          text: text
        });
      });
    }
    markers(result);
  });

  var mapController = {
    filterViewModel: filterViewModel,
    center: center,
    markers: markers,
    zoom: zoom,
    mapOptions: {
      zoomControl: false
    },
    events: events,
    centerMarker: centerMarker,
    centerCircle: centerCircle,
    mapVisible: mapVisible,
    buttonsVisible: buttonsVisible,
    filterbarVisible: filterbarVisible,
    bounds: bounds,
    isInitialized: isInitialized,
    addMarker: addMarker,
    addMarkerHandler: addMarkerHandler,
    centerMapHandler: centerMapHandler,
    removeMarker: function(i) {
      markers.splice(i, 1);
    },
    updateCenter: updateCenter,
    updateZoom: zoom,
    updateCenterMarker: updateCenterMarker,
    updateMyLocationMarker: updateMyLocationMarker,
    initMap: initMap
  };

  return mapController;
};
