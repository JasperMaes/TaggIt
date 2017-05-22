var LocationListController = function(tripViewModel, viewLocationController, filterViewModel) {

  function getPanel(event) {
    return $(event.target).parents(".row").next(".mapPreview");
  }

  var mapPreviewControllers = ko.pureComputed(function() {
    var controllers = [];
    if (!!tripViewModel.currentTrip()) {
      tripViewModel.currentTrip().getAll().forEach(function(locationData) {
        var mapPreviewController = PreviewPanel(locationData, getPanel, true);

        controllers.push(mapPreviewController);
      });
    }
    return controllers;
  });

  function backToMap(controller) {
    controller.showPage("mapView");
  }

  function viewLocation(controller) {
    return function(data, event) {
      viewLocationController.locationData(data);
      controller.showPage("viewLocationView");
    };
  }

  return {
    backToMap: backToMap,
    mapPreviewControllers: mapPreviewControllers,
    openWebsite: function(data) {
      window.open(data.website, "_blank");
    },
    filterViewModel: filterViewModel,
    viewLocation: viewLocation
  };
};
