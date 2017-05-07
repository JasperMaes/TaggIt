var PreferencesController = function() {
  var preferencesController = {

    backToMap: function() {
      showPage("mapView");
    },

    isActive: function(current) {
      return (!!controller.tripViewModel.currentTrip() && (controller.tripViewModel.currentTrip().id == current));
    },

    selectTrip: function(tripId) {
      return function() {
        console.log("Selecting trip: " + tripId)
        controller.tripViewModel.selectTrip(tripId)
      }
    },

    newTripName: ko.observable(""),

    addNewTripHandler: function(controller) {
      var tripLabel = controller.preferencesController.newTripName();
      if (tripLabel) {
        var trip = controller.tripViewModel.createEmptyTrip(tripLabel);
        console.log("Add new trip ", tripLabel);
        controller.tripViewModel.addTrip(trip);
        //TODO message to inform user that trip was added successfully
        controller.preferencesController.newTripName("");
      }
    }

  }

  return preferencesController;
}
