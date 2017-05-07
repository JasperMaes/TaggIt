var SidebarController = function() {
  var isVisible = ko.observable(false);

  var toggle = function() {
    isVisible(!isVisible());
  };

  var close = function(e) {
    isVisible(false);
  };

  var openPreferencesHandler = function(){
    showPage("preferencesView");
    close();
  }

  return {
    isVisible: isVisible,
    toggle: toggle,
    close: close,
    openPreferencesHandler: openPreferencesHandler
  };
};
