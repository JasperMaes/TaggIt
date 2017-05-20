var ViewLocationController = function(editLocationController){
  var locationData = ko.observable();

  function getMapPreviewPanel(event){
    return $(event.target).parent().siblings(".mapPreview");
  }

  var imagePreviewController = ImagePreviewController(locationData, {canDelete: false});

  var viewLocationController = {
    locationData: locationData,
    imagePreview: imagePreviewController,
    mapPreviewController: MapPreviewController(locationData, getMapPreviewPanel, false),
    openWebsite: function(data){
      window.open(data.website, "_blank");
    },
    backToLocationListView: function(controller){
      controller.showPage("locationsListView");
    },
    editLocation: function(controller){
      editLocationController.setLocationData(locationData());
      controller.showPage("editLocationDetailsView");
    },
    openImage: function(data, event){
      var index = locationData().images.indexOf(data);
      imagePreviewController.imageIndex(index);
    }
  };

  return viewLocationController;
};
