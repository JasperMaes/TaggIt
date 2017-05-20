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
      controller.showPage("preferencesView");
      close();
    }
  }

  function viewLocations(controller) {
    return function() {
      controller.showPage("locationsListView");
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
