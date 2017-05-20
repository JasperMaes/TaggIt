var LocationListController = function(tripViewModel, viewLocationController, filterViewModel) {

  function getPanel(event) {
    return $(event.target).parents(".row").next(".mapPreview");
  }

  var mapPreviewControllers = ko.pureComputed(function() {
    var controllers = [];
    if (!!tripViewModel.currentTrip()) {
      tripViewModel.currentTrip().getAll().forEach(function(locationData) {
        var mapPreviewController = MapPreviewController(locationData, getPanel);

        controllers.push(mapPreviewController);
      })
    }
    return controllers;
  })

  return {
    backToMap: function(controller){
      controller.showPage("mapView");
      tripViewModel.currentTrip().filter({});
  },
    mapPreviewControllers: mapPreviewControllers,
    openWebsite: function(data) {
      window.open(data.website, "_blank");
    },
    filterViewModel: filterViewModel,
    viewLocation: function (controller){
      return function(data, event) {
        viewLocationController.locationData(data);
        controller.showPage("viewLocationView");
      }
    }
  }
}
