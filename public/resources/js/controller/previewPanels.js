var MapPreviewController = function(locationData, getPanel, editable) {

  editable = !!editable;

  function openPanelHandler() {
    var $this = $(this);
    $("[data-collapse-group='myDivs']:not([data-target='" + $this.data("target") + "'])").each(function() {
      $($(this).data("target")).collapse("hide");
    });
  }

  function selectCategoryClosePanel(category) {
    if (editable) {
      return function(controller, event) {
        locationData.category(category);
        $(event.target).closest(".changeCategoryCollapse").collapse("toggle");
      };
    } else {
      return function(controller, event) {};
    }
  }

  return {
    editable: editable,
    locationData: locationData,
    selectCategoryClosePanel: selectCategoryClosePanel,
    openPanelHandler: openPanelHandler,
    openMapPreviewHandler: function(controller, event) {
      var panel = getPanel(event);
      panel.collapse("toggle");
      setTimeout(function(event, panel) { //Needs a little timeout to have the correct width of the panel
        var width = panel.width();
        var height = 0.75 * width;
        var lat = ko.unwrap(locationData).position[0];
        var lng = ko.unwrap(locationData).position[1];
        var imageUrl = "http://staticmap.openstreetmap.de/staticmap.php?center=" + lat + "," + lng + "&zoom=16&size=" + width + "x" + height + "&maptype=mapnik";
        panel.find(".frame")
          .css('background-image', 'url(' + imageUrl + ')')
          .css('height', height);
        panel.find(".mapMarker")
          .css("left", Math.floor(width / 2) - 12) // minus the width of the marker
          .css("top", Math.floor(height / 2) - 41); // minus the height of the marker
      }, 50, event, panel.find("div.panel-body"));

      openPanelHandler.call(event.target);
    },

  };
};
