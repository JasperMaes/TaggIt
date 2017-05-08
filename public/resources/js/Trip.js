var Trip = function(tripDetails) {

  function convertObjectToKnockout(trip) {
    var result = {};

    result.id = trip.id;
    result.label = ko.observable(trip.label);
    result.maxId = trip.maxId;
    result.locations = ko.observableArray(trip.locations)

    return result;
  }

  function getAllLocations() {
    return this.details.locations();
  }

  function getLocation(locationId) {
    var result = Message.UnknownLocation;
    var locations = getAllLocations();
    var locationCount = locations.length;
    for (var i = 0; i < locationCount; i++) {
      if (locations[i].id === locationId) {
        result = locations[i];
        break;
      }
    }
    return result;
  }

  function getLocationIndex(locationId) {
    var index = -1;
    var locations = getAllLocations();
    var locationCount = locations.length;
    for (var i = 0; i < locationCount; i++) {
      if (locations[i].id === locationId) {
        index = i;
        break;
      }
    }
    return index;
  }

  function findLocation(searchParameters) {
    //TODO implement searching for locations in a trip
  }

  function addLocation(locationDetails) {
    locationDetails.id = this.details.maxId;
    this.details.locations.push(locationDetails);
    this.details.maxId++;
    return locationDetails.id;
  }

  function removeLocation(locationId) {
    var index = getLocationIndex(locationId);
    if (index > -1) {
      var locations = this.details.locations();
      var removedValue = locations.splice(index, 1)[0]
      this.details.locations(locations);
      return removedValue;
    } else {
      return Message.UnknownLocation;
    }
  }

  return {
    details: convertObjectToKnockout(tripDetails),
    getAll: getAllLocations,
    get: getLocation,
    find: findLocation,
    add: addLocation,
    remove: removeLocation,
    _getRawData: function(){
      return ko.toJS(this.details)
    },
    getKoData: function(){
      return this.details;
    },
    getLabel: function() {
      return this.details.label();
    },
    getId: function() {
      return this.details.id;
    }
  }

}
