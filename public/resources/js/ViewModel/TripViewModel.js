var TripViewModel = function() {

  var trips = ko.observableArray([]);
  var activeTripId = ko.observable(null);
  var activeTripDetails = ko.observable(null);

  ko.computed(function() {
    var tripId = activeTripId();
    if (!!tripId) {
      TripModel.getTripDetails(tripId)
        .then(function(tripDetails) {
          activeTripDetails(tripDetails);
        });
    } else {
      activeTripDetails(null);
    }
  });

  activeTripDetails.subscribe(function(newValue) {
    if (!!newValue) { //Don't update when no trip is selected
      TripModel.updateTrip(newValue);
    }
  });

  function addTrip(tripDetails) {
    var addedTrip;
    return TripModel.addTrip(tripDetails)
      .then(function(trip) {
        addedTrip = trip;
        return refreshTripsList();
      })
      .then(function() {
        return Promise.resolve(addedTrip);
      });
  }

  function tripExists(tripId) {
    return TripModel._getTripIndex(trips(), tripId) > -1;
  }

  function selectTrip(tripId) {
    if (tripExists(tripId)) {
      activeTripId(tripId);
    } else {
      return Message.UnknownTrip;
    }
  }

  function refreshTripsList() {
    return TripModel.getTrips()
      .then(function(tripsList) {
        trips(tripsList);
        return Promise.resolve(Message.TripsListRefreshComplete);
      });
  }

  function removeTrip(tripId) {
    if (tripExists(tripId)) {
      var index = TripModel._getTripIndex(trips(), tripId);
      var removedTrip;
      return TripModel.removeTrip(tripId)
        .then(function(trip) {
          removedTrip = trip;
          return refreshTripsList();
        })
        .then(function() {
          var selectIndex = Math.min(index, trips().length - 1);
          if (!!activeTripId() && selectIndex >= 0) {
            var newCurrentTripId = trips()[selectIndex].id;
            selectTrip(newCurrentTripId);
          } else {
            activeTripId(null);
            activeTripDetails(null);
          }
          return Promise.resolve(removedTrip);
        });

    } else {
      return Promise.reject(Message.UnknownTrip);
    }
  }

  function initialize() {
    return TripModel.initialize()
      .then(function() {
        return TripModel.getTrips();
      }).then(function(tripsList) {
        trips(tripsList);
        return Promise.resolve(Message.InitializationComplete);
      });
  }

  return {
    initialize: initialize,
    trips: trips,
    currentTrip: activeTripDetails,
    _currentTripId: activeTripId,
    addTrip: addTrip,
    selectTrip: selectTrip,
    removeTrip: removeTrip,
    tripExists: tripExists,
    createEmptyTrip: TripModel.createEmptyTrip
  };

};