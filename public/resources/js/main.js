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

var tripViewModel;

$(window).on('load', function() {
  // Use this class to add a ripple effect to a button
  // ==> Only useful when not changing pages since it is too slow to be visible before page changes
  $.material.options.ripples = ".withripple";
  $.material.init();

  tripViewModel = TripViewModel();

  tripViewModel.initialize()
    .then(function() {
      //TODO REMOVE THIS
      //tripViewModel.addRandomTrip()
      tripViewModel.selectTrip("trip2")

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
      var addLocationController = AddLocationController(tripViewModel);
      var editLocationController = EditLocationController(tripViewModel);
      var viewLocationController = ViewLocationController(editLocationController);
      var preferencesController = PreferencesController(tripViewModel);
      var mapController = MapController(updateLocationGpsError, initLocationGpsError, tripViewModel, addLocationController);
      
      controller = {
        mapController: mapController,
        sidebarController: SidebarController(),
        messageContent: ko.observable(),
        addLocationController: addLocationController,
        preferencesController: preferencesController,
        locationListController: LocationListController(tripViewModel, viewLocationController),
        viewLocationController: viewLocationController,
        editLocationController: editLocationController,
        tripViewModel: tripViewModel,
        clearAll: function(){
          Promise.all([TripModel._dataStore.clear(), localforage.clear()])
          .then(function(){
            console.log("All cleared")
            location.reload()
          })
        }
      };

      mapController.initMap();

      if (tripViewModel.trips().length > 0) {
        showPage("mapView")
      } else {
        showPage("preferencesView")
      }

      console.log("All done loading");

    })
})
