var PreferencesController = function() {
  var preferencesController = {

    backToMap: function() {
      showPage("mapView");
    },

    isActive: function(current) {
      var result = (!!controller.tripViewModel.currentTrip() && (controller.tripViewModel.currentTrip().getId() === current));
      return result;
    },

    selectTrip: function() {
        console.log("Selecting trip: " + this.id)
        controller.tripViewModel.selectTrip(this.id)
    },

    newTripName: ko.observable(""),

    //TODO find out why the active trip changes to the new trip when a new trip is added
    addNewTripHandler: function(controller) {
      var tripLabel = controller.preferencesController.newTripName();
      if (tripLabel) {
        var trip = controller.tripViewModel.createEmptyTrip(tripLabel);
        console.log("Add new trip ", tripLabel);
        controller.tripViewModel.addTrip(trip)
        //TODO select added trip if it is the only one
        //TODO message to inform user that trip was added successfully
        controller.preferencesController.newTripName("");
      }
    },

    deleteTripHandler: function() {
        console.log("Deleting trip: " + this.id)
        controller.tripViewModel.removeTrip(this.id);
    },

  }

  return preferencesController;
}
