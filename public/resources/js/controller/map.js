var MapController = function(updateLocationGpsError, initLocationGpsError, tripViewModel) {

  var watchId;

  var buttonsVisible = ko.observable(false);

  var mapController = {
    center: [ko.observable(50.81057), ko.observable(4.93622)],
    zoom: ko.observable(16),
    markers: ko.observableArray([]),
    mapOptions: {
      zoomControl: false
    },
    printMarkers: function(){
      controller.mapController.markers().forEach(function(marker){
        console.log(marker.center[0](), ",", marker.center[1]())
      })
    },
    events: {
      dragstart: function(evt) {
        console.log("DISABLE watch");
        if (watchId > 0) {
          GeoLocation.clearWatch(watchId);
          watchId = -1;
        }
      }
    },
    centerMarker: {
      center: [ko.observable(50.81057), ko.observable(4.93622)],
      draggable: false,
      icon: L.icon.pulse({
        iconSize: [18, 18],
        color: '#2196F3'
      })
    },
    centerCircle: {
      radius: ko.observable(0)
    },
    mapVisible: ko.observable(false),
    buttonsVisible: buttonsVisible,
    filterbarVisible: ko.observable(false),
    bounds: ko.observable(),
    isInitialized: ko.observable(false),

    addMarkerHandler: function() {
      var lat = mapController.centerMarker.center[0]();
      var lng = mapController.centerMarker.center[1]();

      mapController.addMarker([lat, lng]);
    },

    centerMapHandler: function() {
      // Update the location immediately with the current position of the center marker
      // It will also be updated when the watch method calls the callback but this can have some delay
      // Setting the postition immediately avoids this delay
      mapController.updateCenter({
        lat: mapController.centerMarker.center[0](),
        lng: mapController.centerMarker.center[1]()
      });
      if (watchId > 0) {
        GeoLocation.clearWatch(watchId);
        watchId = -1;
      }
      watchId = GeoLocation.watch(mapController.updateMyLocationMarker, updateLocationGpsError);
    },

    addMarker: function(position) {
      controller.addLocationController.locationData.position = position;

      showPage("addLocationView");
    },

    removeMarker: function(i) {
      this.markers.splice(i, 1);
    },

    updateCenter: function(args) {
      var options = args || {};
      this.center[0](options.lat);
      this.center[1](options.lng);
      if (!!options.zoom) {
        this.updateZoom(options.zoom);
      }
      this.updateCenterMarker(options);
    },

    updateZoom: function(zoom) {
      this.zoom(zoom);
    },

    updateCenterMarker: function(options) {
      this.centerMarker.center[0](options.lat);
      this.centerMarker.center[1](options.lng);
      this.centerCircle.radius((options.accuracy || 0) * 2);
    },

    updateMyLocationMarker: function(position) {
      var accuracy = position.coords.accuracy;
      var centerOptions = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: (accuracy > 100 && accuracy < 400) ? accuracy : 0
      };
      mapController.updateCenter(centerOptions);

      mapController.buttonsVisible(true);
      mapController.mapVisible(true);
      mapController.filterbarVisible(true);
    },

    initMap: function() {
      GeoLocation.get().then(function(position) {
        var pos = [position.coords.latitude, position.coords.longitude];
        var accuracy = position.coords.accuracy;
        console.log("Got actual position");
        var centerOptions = {
          lat: pos[0],
          lng: pos[1],
          zoom: 16,
          accuracy: (accuracy > 100 && accuracy < 400) ? accuracy : 0
        };
        this.updateCenter(centerOptions);
        this.buttonsVisible(true);
        this.mapVisible(true);
        this.filterbarVisible(true);
        this.isInitialized(true);
        watchId = GeoLocation.watch(this.updateMyLocationMarker, updateLocationGpsError);
      }.bind(this)).catch(function(error) {
        initLocationGpsError(error);
        window.setTimeout(this.initMap, 1000);
      });
    }
  };

  //TODO CONTINUE WITH SEARCHING WHY NOT CORRECTLY UPDATING
  ko.computed(function() {
    var result = [];
    console.log("Updating markers on map")
    var trip = tripViewModel.currentTrip();
    if (!!trip) {
      console.log("trip is ok", trip.getKoData().locations().length)
      trip.getKoData().locations().forEach(function(location) {
        result.push({
          center: [ko.observable(location.position[0]), ko.observable(location.position[1])],
          draggable: false,
          opened: ko.observable(false)
        })
      })
    }
    mapController.markers(result);
  })

  return mapController;
};
