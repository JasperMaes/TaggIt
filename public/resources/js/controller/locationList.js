var LocationListController = function() {

  function getPanel(event) {
    return $(event.target).parents(".row").next(".mapPreview")
  }

  var mapPreviewControllers = ko.pureComputed(function() {
    var controllers = []
    if (!!controller.tripViewModel.currentTrip()) {
      controller.tripViewModel.currentTrip().getAll().forEach(function(locationData) {
        var mapPreviewController = MapPreviewController(locationData, getPanel);

        controllers.push(mapPreviewController)
      })
    }
    return controllers
  })

  var locationListController = {
    mapPreviewControllers: mapPreviewControllers,
    openWebsite: function(data) {
      console.log(data)
      window.open(data.website, "_blank");
    },
    viewLocation: function(data, event) {
      controller.viewLocationController.locationData(data);
      showPage("viewLocationView")
    }

  }

  return locationListController;
}
