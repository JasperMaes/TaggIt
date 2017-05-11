var LocationListController = function(tripViewModel, viewLocationController) {

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
    mapPreviewControllers: mapPreviewControllers,
    openWebsite: function(data) {
      window.open(data.website, "_blank");
    },
    viewLocation: function(data, event) {
      viewLocationController.locationData(data);
      showPage("viewLocationView");
    }
  }
}
