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

  var searchTerm = ko.observable("");

  function search() {
    tripViewModel.currentTrip().filter({
      title: searchTerm()
    });
  }

  return {
    mapPreviewControllers: mapPreviewControllers,
    openWebsite: function(data) {
      window.open(data.website, "_blank");
    },
    searchTerm: searchTerm,
    search: search,
    viewLocation: function(data, event) {
      viewLocationController.locationData(data);
      showPage("viewLocationView");
    }
  }
}
