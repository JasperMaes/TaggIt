var controller;

function showPage(pageName) {
  var element = $("body > div.page")
  if (element.length > 0) {
    ko.cleanNode(element[0]);
    $("body").empty()
  }
  var page = $($("#" + pageName + "-template").html())

  $("body").append(page);
  $("#" + pageName).addClass("active");

  ko.applyBindings(controller, page[0])
}

function updateLocationGpsError(error) {
  GeoLocation.printError(error);
  controller.mapController.buttonsVisible(false);
  controller.mapController.mapVisible(false);
  controller.mapController.filterbarVisible(false);
  controller.messageContent("GPS error: Could not retrieve location");
}

function initLocationGpsError(error) {
  console.log("initLocationGpsError");
  GeoLocation.printError(error);
  controller.messageContent("GPS error: Initialization error; is the GPS enabled?");
}

function removeAutoSync() {
  console.log("OFFLINE")
  controller.isOnline(false);
  window.removeEventListener('online', addAutoSync);
  if (!!syncTimer) {
    clearInterval(timer);
    syncTimer = null;
  }
}

var syncTimer = null;

function addAutoSync() {
  console.log("ONLINE");
  controller.isOnline(true);
  var triggerFunc = function() {
    console.log("Trigger");
    SyncTools.triggerSync()
  }
  // Sync every 15 minutes
  timer = setInterval(triggerFunc, 15 * 60 * 1000)
}

//TODO: replace with background sync service worker if it supports periodic sync
window.addEventListener('online', addAutoSync);
window.addEventListener('offline', removeAutoSync);


var tripViewModel;

$(window).on('load', function() {

  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/service-worker.js')
             .then(function() { console.log("Service Worker Registered"); });
  }


  // Use this class to add a ripple effect to a button
  // ==> Only useful when not changing pages since it is too slow to be visible before page changes
  //$.material.options.ripples = ".withripple";
  $.material.init();

  tripViewModel = TripViewModel();

  tripViewModel.initialize()
    .then(function() {
      // Subscribe to changes in the currently active trip to store the ID
      // This is needed to reload it again when the application starts again
      tripViewModel.currentTrip.subscribe(function(newValue) {
        console.log("Active trip changed to ", newValue)
        if (!!newValue) {
          localforage.setItem("lastActiveTrip", newValue.getId())
        } else {
          localforage.removeItem("lastActiveTrip")
        }
      })

      return localforage.getItem("lastActiveTrip");
    })
    .then(function(lastActiveTrip) {
      //Restore last active trip from localforage
      if (!!lastActiveTrip) {
        console.log("Read last active trip ", lastActiveTrip)
        tripViewModel.selectTrip(lastActiveTrip);
      }
    })
    .then(function() {
      var filterViewModel = FilterViewModel()
      var addLocationController = AddLocationController(tripViewModel);
      var editLocationController = EditLocationController(tripViewModel);
      var viewLocationController = ViewLocationController(editLocationController);
      var preferencesController = PreferencesController(tripViewModel);
      var mapController = MapController(updateLocationGpsError, initLocationGpsError, tripViewModel, addLocationController, filterViewModel);

      preferencesController.initGoogleDriveClient();

      controller = {
        mapController: mapController,
        sidebarController: SidebarController(),
        messageContent: ko.observable(),
        addLocationController: addLocationController,
        preferencesController: preferencesController,
        locationListController: LocationListController(tripViewModel, viewLocationController, filterViewModel),
        viewLocationController: viewLocationController,
        editLocationController: editLocationController,
        tripViewModel: tripViewModel,
        clearAll: function() {
          Promise.all([TripModel._dataStore.clear(), localforage.clear()])
            .then(function() {
              console.log("All cleared")
              location.reload()
            })
        },
        isOnline: ko.observable(false)
      };

      mapController.initMap();

      if (navigator.onLine) {
        addAutoSync()
      } else {
        console.log("Do nothing, offline")
      }

      if (tripViewModel.trips().length > 0) {
        showPage("mapView")
      } else {
        showPage("preferencesView")
      }

      console.log("All done loading");

    })
})
