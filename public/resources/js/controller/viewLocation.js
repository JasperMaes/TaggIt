var ViewLocationController = function(){
  var locationData = ko.observable();

  function getMapPreviewPanel(event){
    return $(event.target).parent().siblings(".mapPreview")
  }

  var imagePreviewController = ImagePreviewController(locationData, {canDelete: false});

  var viewLocationController = {
    locationData: locationData,
    imagePreview: imagePreviewController,
    mapPreviewController: MapPreviewController(locationData, getMapPreviewPanel),
    openWebsite: function(data){
      window.open(data.website, "_blank");
    },
    backToLocationListView: function(){
      showPage("locationsListView");
    },
    editLocation: function(controller){
      console.log("Edit location", controller.viewLocationController.locationData())
    },
    openImage: function(data, event){
      console.log("Edit image")
      var index = locationData().images.indexOf(data)
      imagePreviewController.imageIndex(index);
    }
  }

  return viewLocationController;
}
