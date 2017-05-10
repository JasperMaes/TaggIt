var ViewLocationController = function(){
  var locationData = ko.observable();

  function openPanelHandler() {
    var $this = $(this);
    $("[data-collapse-group='myDivs']:not([data-target='" + $this.data("target") + "'])").each(function() {
      $($(this).data("target")).collapse("hide");
    });
  }

  function getMapPreviewPanel(event){
    return $(event.target).parent().siblings(".mapPreview")
  }

  var viewLocationController = {
    locationData: locationData,
    openPanelHandler: openPanelHandler,
    mapPreviewController: MapPreviewController(openPanelHandler, locationData, getMapPreviewPanel),
    openWebsite: function(data){
      console.log(data)
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
