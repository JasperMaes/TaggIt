var PreferencesController = function() {
  var preferencesController = {

    backToMap: function() {
      showPage("mapView");
    },

    isActive: function(current) {
      return (!!controller.tripViewModel.currentTrip() && (controller.tripViewModel.currentTrip().id == current));
    },

    selectTrip: function(tripId){
      return function(){
        console.log("Selecting trip: "+tripId)
        controller.tripViewModel.selectTrip(tripId)
      }
    }

  }

  return preferencesController;
}
