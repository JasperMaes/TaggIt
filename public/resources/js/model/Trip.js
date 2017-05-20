var Trip = function(tripDetails) {

  function convertTripObjectToKnockout(trip) {
    var result = {};

    result.id = trip.id;
    result.label = ko.observable(trip.label);
    result.maxId = trip.maxId;
    result.locations = ko.observableArray(trip.locations);
    result.createTime = trip.createTime;
    result.editTime = trip.editTime;

    return result;
  }

  var details = convertTripObjectToKnockout(tripDetails);

  var filter = ko.observable({});

  function findLocation(searchParameters) {
    return applyFilter(searchParameters, getAllLocations());
  }

  function applyFilter(searchParameters, locations) {
    return $.grep(locations, Util.compareObjectParameters(searchParameters));
  }

  function getAllLocations() {
    return details.locations();
  }

  var getAllFilteredLocations = ko.computed(function() {
    var result = applyFilter(filter(), details.locations());
    return result;
  });

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

  function getLocationIndex(locationId, locations) {
    locations = locations || getAllLocations();
    var index = -1;
    var locationCount = locations.length;
    for (var i = 0; i < locationCount; i++) {
      if (locations[i].id === locationId) {
        index = i;
        break;
      }
    }
    return index;
  }

  function addLocation(locationDetails) {
    locationDetails.id = this.details.maxId;
    this.details.locations.push(locationDetails);
    this.details.maxId++;
    this.details.editTime = new Date();
    return locationDetails.id;
  }

  function removeLocation(locationId) {
    var index = getLocationIndex(locationId);
    if (index > -1) {
      var locations = this.details.locations();
      var removedValue = locations.splice(index, 1)[0]
      this.details.locations(locations);
      this.details.editTime = new Date();
      return removedValue;
    } else {
      return Message.UnknownLocation;
    }
  }

  function updateLocation(updatedLocation) {
    var locations = this.details.locations();
    var index = getLocationIndex(updatedLocation.id, locations)
    locations[index] = updatedLocation;
    this.details.locations(locations);
    this.details.editTime = new Date();
  }

  return {
    filter: filter,
    details: details,
    getAll: getAllLocations,
    getAllFiltered: getAllFilteredLocations,
    get: getLocation,
    find: findLocation,
    add: addLocation,
    remove: removeLocation,
    find: findLocation,
    update: updateLocation,
    _getRawData: function() {
      return ko.toJS(this.details)
    },
    getKoData: function() {
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
