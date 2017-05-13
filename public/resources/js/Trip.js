var Trip = function(tripDetails) {

  function convertObjectToKnockout(trip) {
    var result = {};

    result.id = trip.id;
    result.label = ko.observable(trip.label);
    result.maxId = trip.maxId;
    result.locations = ko.observableArray(trip.locations)

    return result;
  }

  var details = convertObjectToKnockout(tripDetails);

  var filter = ko.observable({});

  function findLocation(searchParameters) {
    return applyFilter(searchParameters, getAllLocations());
  }

  function compareObjectParameters(parameters) {
    return function(object) {
      var objectMatches = Object.keys(parameters).every(function(key, index, array) {
        if (object.hasOwnProperty(key)) {
          var objectValue = object[key];
          var paramValue = parameters[key] || "";
          return (objectValue !== null) && (objectValue !== undefined) && (objectValue.toUpperCase().match(paramValue.toUpperCase()));
        } else {
          return true;
        }
      })
      return objectMatches;
    }
  }

  function applyFilter(searchParameters, locations) {
    return $.grep(locations, compareObjectParameters(searchParameters));
  }

  function getAllLocations() {
    return details.locations();
  }

  var getAllFilteredLocations = ko.computed(function() {
    var result = applyFilter(filter(), details.locations());
    console.log("returning filtered locations ", filter())
    console.log(result);
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

  function updateLocation(updatedLocation) {
    var locations = this.details.locations();
    var index = getLocationIndex(updatedLocation.id, locations)
    console.log(index, " vs ", updatedLocation.id)
    locations[index] = updatedLocation;
    this.details.locations(locations);
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
