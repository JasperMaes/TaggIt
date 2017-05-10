var ViewLocationController = function(){
  var locationData = ko.observable();

  function getMapPreviewPanel(event){
    return $(event.target).parent().siblings(".mapPreview")
  }

  var viewLocationController = {
    locationData: locationData,
    mapPreviewController: MapPreviewController(locationData, getMapPreviewPanel),
    openWebsite: function(data){
      window.open(data.website, "_blank");
    },
    backToLocationListView: function(){
      showPage("locationsListView");
    },
    editLocation: function(controller){
      console.log("Edit location", controller.viewLocationController.locationData())
    }

  }

  return viewLocationController;
}
