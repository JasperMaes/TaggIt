var TripModel = (function() {

  var tripStore = localforage.createInstance({
    name: "TripStore"
  });

  var maxTripId = undefined;

  function initialize() {
    var tripListPromise = tripStore.getItem("tripList")
      .then(function(data) {
        if (!!data) {
          return Promise.resolve(true);
        } else {
          return tripStore.setItem("tripList", [])
        }
      })

    var maxIdPromise = tripStore.getItem("maxTripId")
      .then(function(data) {
        if (!!data) {
          maxTripId = data;
          return Promise.resolve(true);
        } else {
          maxTripId = 0;
          return tripStore.setItem("maxTripId", 0)
        }
      })
      
    return Promise.all([tripListPromise, maxIdPromise])
      .then(function() {
        return Promise.resolve(Message.LocalForageInitComplete);
      })
  }

  function getTripsList() {
    return tripStore.getItem("tripList");
  }

  function setTripsList(tripList) {
    return tripStore.setItem("tripList", tripList);
  }

  function addToTripListTripsList(id, label) {
    return getTripsList()
      .then(function(tripList) {
        var current = {
          id: id,
          label: label
        };
        tripList.push(current);
        return setTripsList(tripList);
      })
  }

  function getTripIndex(tripsList, tripId){
    var index = -1;
    var arrayLength = tripsList.length;
    for (var i = 0; i < arrayLength; i++) {
      if (tripsList[i].id === tripId) {
        index = i;
        break
      }
    }
    return index;
  }

  function removeFromTripList(id) {
    return getTripsList()
      .then(function(tripsList) {
        var index = getTripIndex(tripsList, id);
        tripsList.splice(index, 1);
        return setTripsList(tripsList);
      })
  }

  function getTripDetails(tripId) {
    return existsTrip(tripId)
      .then(function(exists) {
        if (exists) {
          return tripStore.getItem(tripId)
            .then(function(tripDetails) {
              return Promise.resolve(Trip(tripDetails))
            })
        } else {
          return Promise.reject(Message.UnknownTrip)
        }
      })
  }

  function addTrip(tripDetails) {
    var tripId = "trip" + maxTripId;
    return existsTrip(tripId)
      .then(function(exists) {
        if (exists) {
          return Promise.reject(Message.TripExists);
        } else {
          tripDetails.id = tripId;

          var setItemPromise = tripStore.setItem(tripId, tripDetails);
          var updateTripListPromise = addToTripListTripsList(tripId, tripDetails.label);
          var updateMaxIdPromise = tripStore.setItem("maxTripId", ++maxTripId)

          return Promise.all([setItemPromise, updateTripListPromise, updateMaxIdPromise])
            .then(function() {
              return Promise.resolve(Trip(tripDetails));
            })
        }
      })
  }

  function addTripWithId(tripDetails){
    var tripId = tripDetails.id
    var setItemPromise = tripStore.setItem(tripId, tripDetails);
    var updateTripListPromise = addToTripListTripsList(tripId, tripDetails.label);

    return Promise.all([setItemPromise, updateTripListPromise])
      .then(function() {
        return Promise.resolve(Trip(tripDetails));
      })
  }

  function existsTrip(tripId) {
    return getTripsList()
      .then(function(tripsList) {
        var index = getTripIndex(tripsList, tripId)
        return Promise.resolve(index > -1);
      })
  }

  function removeTrip(tripId) {
    return existsTrip(tripId)
      .then(function(exists) {
        if (exists) {
          var tripsListPromise = removeFromTripList(tripId)
          var removeItemPromise = tripStore.removeItem(tripId)
          return Promise.all([tripsListPromise, removeItemPromise]).then(function() {
            return Promise.resolve(Message.TripRemoveSuccess);
          })
        } else {
          return Promise.resolve(Message.UnknownTrip);
        }
      })
  }

  function createEmptyTrip(tripLabel){
    return {
      label: tripLabel,
      locations: [],
      maxId: 0,
      createTime: new Date(),
      editTime: null
    }
  }

  function updateTrip(trip){
    return existsTrip(trip.getId())
    .then(function (exists){
      if(exists){
        return tripStore.setItem(trip.getId(), trip._getRawData())
        .then(function(){
          return Promise.resolve(Message.TripUpdateSuccess);
        })
      } else {
        return Promise.reject(Message.UnknownTrip);
      }
    })
  }

  return {
    initialize: initialize,
    getTrips: getTripsList,
    setTrips: setTripsList,
    getTripDetails: getTripDetails,
    existsTrip: existsTrip,
    addTrip: addTrip,
    addTripWithId: addTripWithId,
    removeTrip: removeTrip,
    _dataStore: tripStore,
    _getMaxTripId: function() {
      return maxTripId;
    },
    _setMaxTripId: function(newValue) {
      maxTripId = newValue;
      return tripStore.setItem("maxTripId", newValue)
    },
    _getTripIndex: getTripIndex,
    createEmptyTrip: createEmptyTrip,
    updateTrip: updateTrip
  }

})()
