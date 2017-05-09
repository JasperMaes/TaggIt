var ViewLocationController = function(){
  var locationListController = {
    locationData: ko.observable(),
    openPanelHandler: function() {
      var $this = $(this);
      $("[data-collapse-group='myDivs']:not([data-target='" + $this.data("target") + "'])").each(function() {
        $($(this).data("target")).collapse("hide");
      });
    },
    openMapPreviewHandler: function(controller, event) {
        $(event.target).parents(".row").next(".mapPreview").collapse("toggle")
        setTimeout(function(location, event) { //Needs a little timeout to have the correct width of the panel
          var panel = $(event.target).parents(".row").next(".mapPreview").find("div.panel-body");
          var width = panel.width();
          var height = 0.75 * width;
          console.log(location)
          var lat = location.position[0];
          var lng = location.position[1];
          var imageUrl = "http://staticmap.openstreetmap.de/staticmap.php?center=" + lat + "," + lng + "&zoom=16&size=" + width + "x" + height + "&maptype=mapnik"
          panel.find("#frame")
            .css('background-image', 'url(' + imageUrl + ')')
            .css('height', height);
        }, 500, controller.viewLocationController.locationData(), event)
        controller.viewLocationController.openPanelHandler.call(this);
    },
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

  return locationListController;
}
