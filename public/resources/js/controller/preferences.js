var PreferencesController = function(tripViewModel) {
  var newTripName = ko.observable("");
  var signedInStatus = ko.observable(false);
  var lastSyncText = ko.computed(function() {
    var dateString = !!SyncTools.lastSyncDate() ? Util.getDateTimeString(SyncTools.lastSyncDate()) : 'Never';
    return 'Last sync: ' + dateString;
  });

  function isActive(current) {
    var result = (!!tripViewModel.currentTrip() && (tripViewModel.currentTrip().getId() === current));
    return result;
  }

  function signInHandler() {
    if (!signedInStatus()) {
      GoogleSignin.signIn();
    }
  }

  function signOutHandler() {
    if (signedInStatus()) {
      GoogleSignin.signOut();
    }
  }

  function initGoogleDriveClient() {
    GoogleSignin.load()
      .then(GoogleSignin.init)
      .then(function() {
        // Handle the initial sign-in state.
        signedInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        gapi.auth2.getAuthInstance().isSignedIn.listen(signedInStatus);

        return SyncTools.getLastSyncDate();
      });
  }

  function addNewTripHandler(controller) {
    var tripLabel = newTripName();
    if (tripLabel) {
      var trip = tripViewModel.createEmptyTrip(tripLabel);
      trip.createTime = new Date();
      tripViewModel.addTrip(trip)
        .then(function() {
          var trips = tripViewModel.trips();
          if (trips.length === 1) {
            tripViewModel.selectTrip(trips[0].id);
          }
        });
      newTripName("");
    }
  }

  function deleteTripHandler() {
    var result = confirm("Do you really want to delete this trips and all its locations?");
    if (result) {
      tripViewModel.removeTrip(this.id);
    }
  }

  return {
    signInHandler: signInHandler,
    signOutHandler: signOutHandler,
    signedInStatus: signedInStatus,
    initGoogleDriveClient: initGoogleDriveClient,
    isActive: isActive,
    newTripName: newTripName,
    addNewTripHandler: addNewTripHandler,
    deleteTripHandler: deleteTripHandler,
    lastSyncText: lastSyncText,
    backToMap: function(controller) {
      controller.showPage("mapView");
    },
    selectTrip: function() {
      tripViewModel.selectTrip(this.id);
    }
  };

};
