var PreferencesController = function(tripViewModel) {
  var newTripName = ko.observable("");

  function isActive(current) {
    var result = (!!tripViewModel.currentTrip() && (tripViewModel.currentTrip().getId() === current));
    return result;
  }

  return {

    backToMap: function() {
      showPage("mapView");
    },

    isActive: isActive,

    selectTrip: function() {
      console.log("Selecting trip: " + this.id)
      tripViewModel.selectTrip(this.id)
    },

    newTripName: newTripName,

    addNewTripHandler: function(controller) {
      var tripLabel = newTripName();
      if (tripLabel) {
        var trip = tripViewModel.createEmptyTrip(tripLabel);
        trip.createTime = new Date();
        console.log("Add new trip ", tripLabel);
        tripViewModel.addTrip(trip)
        //TODO select added trip if it is the only one
        //TODO message to inform user that trip was added successfully
        newTripName("");
      }
    },

    deleteTripHandler: function() {
      console.log("Deleting trip: " + this.id)
      tripViewModel.removeTrip(this.id);
    },

  }

}
