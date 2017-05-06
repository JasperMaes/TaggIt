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

$(window).on('load', function() {
  // Use this class to add a ripple effect to a button
  // ==> Only useful when not changing pages since it is too slow to be visible before page changes
  $.material.options.ripples = ".withripple";
  $.material.init();

  //TODO for all event handlers: add data parameter to get access to the controller
  controller = {
    mapController: MapController(updateLocationGpsError, initLocationGpsError),
    sidebarController: SidebarController(),
    messageContent: ko.observable(),
    addLocationController: AddLocationController()
  };

  controller.mapController.initMap();

  console.log("All done loading");

  showPage("mapView")

  //showPage("addLocationView")
  //showPage("addLocationDetailsView");
  //controller.addLocationController.locationData.category("nature");
})
