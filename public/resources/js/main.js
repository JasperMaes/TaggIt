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

  tripViewModel.addRandomTrip = function() {
    console.log("Create random trip")
    var details = {
      label: "Trip "+Math.floor(Math.random() * (100 - 10)) + 10,
      maxId: 2,
      locations: [{
          id: 0,
          title: "Location 1",
          position: [50.939343499999995, 4.3371832]
        },
        {
          id: 1,
          title: "Location 2",
          position: [50.93937, 4.3371932]
        }
      ]
    }

    tripViewModel.addTrip(details);
  }

  tripViewModel.initialize()
    .then(function(){
      //TODO REMOVE THIS
      //tripViewModel.addRandomTrip()
      tripViewModel.selectTrip("trip2")

      // Subscribe to changes in the currently active trip to store the ID
      // This is needed to reload it again when the application starts again
      tripViewModel.currentTrip.subscribe(function(newValue){
        console.log("Active trip changed to ", newValue)
        if(!!newValue){
          localforage.setItem("lastActiveTrip", newValue.id)
        }
      })

      return localforage.getItem("lastActiveTrip");
    })
    .then(function(lastActiveTrip){
      if(!!lastActiveTrip){
        console.log("Read last active trip ", lastActiveTrip)
        tripViewModel.selectTrip(lastActiveTrip);
      }
    })
    .then(function() {
      //TODO for all event handlers: add data parameter to get access to the controller
      controller = {
        mapController: MapController(updateLocationGpsError, initLocationGpsError),
        sidebarController: SidebarController(),
        messageContent: ko.observable(),
        addLocationController: AddLocationController(),
        preferencesController: PreferencesController(),
        tripViewModel: tripViewModel
      };

      controller.mapController.initMap();

      console.log("All done loading");

      showPage("mapView")
    })
    setTimeout(function(){
    showPage("preferencesView")}, 400)
  //showPage("addLocationView")
  //showPage("addLocationDetailsView");
  //controller.addLocationController.locationData.category("nature");
})
