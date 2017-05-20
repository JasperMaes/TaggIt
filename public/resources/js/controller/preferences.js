var PreferencesController = function(tripViewModel) {
  var newTripName = ko.observable("");

  function isActive(current) {
    var result = (!!tripViewModel.currentTrip() && (tripViewModel.currentTrip().getId() === current));
    return result;
  }

var signInHandler = function(){
  if(!signedInStatus()){
    GoogleSignin.signIn();
  }
};
var signOutHandler = function(){
  if(signedInStatus()){
    GoogleSignin.signOut();
  }
};
var signedInStatus = ko.observable(false);

  function initGoogleDriveClient() {
    GoogleSignin.load()
      .then(GoogleSignin.init)
      .then(function() {
        // Handle the initial sign-in state.
        signedInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        gapi.auth2.getAuthInstance().isSignedIn.listen(signedInStatus);

        return SyncTools.getLastSyncDate()
      })
  }

  return {
    signInHandler: signInHandler,
    signOutHandler: signOutHandler,
    signedInStatus: signedInStatus,
    initGoogleDriveClient: initGoogleDriveClient,

    backToMap: function(controller) {
      showPage("mapView", controller);
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

    lastSyncText: ko.computed(function(){
      var dateString = !!SyncTools.lastSyncDate() ? Util.getDateTimeString(SyncTools.lastSyncDate()) : 'Never';
      return 'Last sync: '+dateString;
    })


  }

}
