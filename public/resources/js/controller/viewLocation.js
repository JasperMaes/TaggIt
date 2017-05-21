var ViewLocationController = function(editLocationController) {
  var locationData = ko.observable();
  var imagePreviewController = ImagePreviewController(locationData, {
    canDelete: false
  });

  function getMapPreviewPanel(event) {
    return $(event.target).parent().siblings(".mapPreview");
  }

  var mapPreviewController = PreviewPanel(locationData, getMapPreviewPanel, false);

  function editLocation(controller) {
    editLocationController.setLocationData(locationData());
    controller.showPage("editLocationDetailsView");
  }

  function openImage(data, event) {
    var index = locationData().images.indexOf(data);
    imagePreviewController.imageIndex(index);
  }

  var viewLocationController = {
    locationData: locationData,
    imagePreview: imagePreviewController,
    mapPreviewController: mapPreviewController,
    openWebsite: function(data) {
      window.open(data.website, "_blank");
    },
    backToLocationListView: function(controller) {
      controller.showPage("locationsListView");
    },
    editLocation: editLocation,
    openImage: openImage
  };

  return viewLocationController;
};