var SidebarController = function() {
  var isVisible = ko.observable(false);

  var toggle = function() {
    isVisible(!isVisible());
  };

  var close = function(e) {
    isVisible(false);
  };

  var openPreferencesHandler = function(controller) {
    return function() {
      showPage("preferencesView", controller);
      close();
    }
  }

  function viewLocations(controller) {
    return function() {
      showPage("locationsListView", controller);
      close();
    }
  }

  function openAddLocationHandler(controller) {
    return function() {
      controller.mapController.addMarkerHandler(controller)
    }
  }

  return {
    isVisible: isVisible,
    toggle: toggle,
    close: close,
    openPreferencesHandler: openPreferencesHandler,
    openAddLocationHandler: openAddLocationHandler,
    viewLocations: viewLocations
  };
};
