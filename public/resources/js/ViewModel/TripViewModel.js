var TripViewModel = function() {

  var trips = ko.observableArray([]);
  var activeTripId = ko.observable(null);
  var activeTripDetails = ko.observable(null);

  ko.computed(function() {
    var tripId = activeTripId();
    console.log("LOAD trip details: " + tripId)
    if (!!tripId) {
      TripModel.getTripDetails(tripId)
        .then(function(tripDetails) {
          console.log("Got values, set trip details")
          activeTripDetails(tripDetails)
        });
    } else {
      activeTripDetails(null);
    }
  })

  function addTrip(id, tripDetails) {
    // TODO implement add trip in the viewModel
    // Creates ID for trip by itself

    return TripModel.addTrip(id, tripDetails)
      .then(function(trip) {
        return refreshTripsList()
          .then(function() {
            return Promise.resolve(trip);
          })
      })
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
          return refreshTripsList()
        })
        .then(function() {
          var selectIndex = Math.min(index, trips().length-1);
          if (!!activeTripId() && selectIndex >= 0) {
            var newCurrentTripId = trips()[selectIndex].id
            selectTrip(newCurrentTripId);
          } else {
            activeTripId(null);
            activeTripDetails(null);
          }
          return Promise.resolve(removedTrip);
        })

    } else {
      return Promise.reject(Message.UnknownTrip);
    }
    // TODO verify whether the current trip needs to be updated
  }

  function initialize() {
    return TripModel.initialize()
      .then(function() {
        return TripModel.getTrips()
      }).then(function(tripsList) {
        trips(tripsList);
        return Promise.resolve(Message.InitializationComplete)
      })
  }

  return {
    initialize: initialize,
    trips: trips,
    currentTrip: activeTripDetails,
    addTrip: addTrip,
    selectTrip: selectTrip,
    removeTrip: removeTrip,
    tripExists: tripExists,
    createEmptyTrip: TripModel.createEmptyTrip
  }

}
