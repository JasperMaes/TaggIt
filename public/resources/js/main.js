

function showPage(pageName, controller) {
  var element = $("body > div.page")
  if (element.length > 0) {
    ko.cleanNode(element[0]);
    $("body").empty()
  }

  var page = $(controller.templates[pageName]);
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

function preloadViews(viewsToLoad) {
  var headers = new Headers();
  headers.append("Content-Type", "text/html");
  var requestParams = {
    headers: headers,
    method: "GET"
  };

  // Load template file and stored in templates global
  viewsToLoad.forEach(function(viewName) {
    fetch('resources/templates/' + viewName + '.html', requestParams)
      .then(function(response) {
        return response.text();
      }).then(function(content) {
        templates[viewName] = content;
      });
  })
}

function setupServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(function() {
        console.log("Service Worker Registered");
      });
  }
}
$(window).on('load', function() {
var controller = {};
controller.templates = {};

  setupServiceWorker();
  var viewsToLoad = ["mapView", "addLocationView", "addLocationDetailsView", "preferencesView", "locationsListView", "viewLocationView", "editLocationDetailsView"];
  preloadViews(viewsToLoad, controller.templates);
  initializeApp(controller);
})

function setupAutoSync(controller) {
  if (navigator.onLine) {
    SyncTools.addAutoSync(controller)
  }
  //TODO: replace with background sync service worker if it supports periodic sync
  window.addEventListener('online', function() {
    SyncTools.addAutoSync(controller)
  });
  window.addEventListener('offline', function() {
    SyncTools.removeAutoSync(controller)
  });
}

function initializeApp(controller) {
  $.material.init();

  var tripViewModel = TripViewModel();


  tripViewModel.initialize()
    .then(function() {
      // Subscribe to changes in the currently active trip to store the ID
      // This is needed to reload it again when the application starts again
      tripViewModel.currentTrip.subscribe(function(newValue) {
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

      controller.mapController = mapController;
      controller.sidebarController = SidebarController();
      controller.messageContent = ko.observable();
      controller.addLocationController = addLocationController;
      controller.preferencesController = preferencesController;
      controller.locationListController = LocationListController(tripViewModel, viewLocationController, filterViewModel);
      controller.viewLocationController = viewLocationController;
      controller.editLocationController = editLocationController;
      controller.tripViewModel = tripViewModel;
      controller.clearAll = function() {
        Promise.all([TripModel._dataStore.clear(), localforage.clear()])
          .then(function() {
            location.reload()
          })
      };
      controller.isOnline = ko.observable(false);

      mapController.initMap();
      preferencesController.initGoogleDriveClient();

      setupAutoSync(controller);

      // Show initial page
      // If there are no trips, user is redirected to preferences to add one
      if (tripViewModel.trips().length > 0) {
        showPage("mapView", controller)
      } else {
        showPage("preferencesView", controller)
      }

      console.log("All done loading");

    })
}
