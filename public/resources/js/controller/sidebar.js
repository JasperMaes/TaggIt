var SidebarController = function() {
  var isVisible = ko.observable(false);

  var toggle = function() {
    isVisible(!isVisible());
  };

  var close = function(e) {
    isVisible(false);
  };

  return {
    isVisible: isVisible,
    toggle: toggle,
    close: close
  };
};
