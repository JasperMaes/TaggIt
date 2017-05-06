var TripRepository = (function() {

  var tripStore = localforage.createInstance({name: "TripStore"});

  function initialize() {
    return tripStore.getItem("tripList")
      .then(function(data) {
        if (!!data) {
          return Promise.resolve(Message.LocalForageInitComplete);
        } else {
          return tripStore.setItem("tripList", [])
            .then(function() {
              return Promise.resolve(Message.LocalForageInitComplete);
            })
        }
      })
  }

  function getTripsList() {
    return tripStore.getItem("tripList");
  }

  function setTripsList(tripList) {
    return tripStore.setItem("tripList", tripList);
  }

  function getTripDetails(tripId) {
    console.log("Retrieving trip")
    return tripStore.getItem(tripId)
      .then(function(tripDetails) {
        console.log("Trip found: " + tripId);
        return Promise.resolve(Trip(tripDetails))
      })
  }

  function addTrip(tripId, tripDetails) {
    tripDetails.id = tripId;
    var setItemPromise = tripStore.setItem(tripId, tripDetails);
    var updateTripListPromise = getTripsList()
      .then(function(tripList) {
        if (tripList.indexOf(tripId) >= 0) {
          console.log("Trip already exists, not saving it");
          return Promise.reject(Message.TripExists);
        } else {
          tripList.push(tripId);
          return setTripsList(tripList)
        }
      })

    return Promise.all([setItemPromise, updateTripListPromise])
      .then(function() {
        return Promise.resolve(Trip(tripDetails));
      })
  }

  function removeTrip(tripId){
    // TODO implement remove trip from LocalForage
    console.log("Trip deletion is still to be implemented")
    return Promise.reject(Message.NotImplemented)
  }

  return {
    initialize: initialize,
    getTrips: getTripsList,
    getTripDetails: getTripDetails,
    addTrip: addTrip,
    removeTrip: removeTrip
  }

})()
