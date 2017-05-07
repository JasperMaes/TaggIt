var Trip = function(tripDetails) {

  function getAllLocations() {
    return tripDetails.locations;
  }

  function getLocation(locationId) {
    var result = null;
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
    locationDetails.id = tripDetails.maxId;
    tripDetails.locations.push(locationDetails);
    tripDetails.maxId++;
  }

  function removeLocation(locationId) {
    var index = getLocationIndex(locationId);
    if (index > -1) {
      return tripDetails.locations.splice(index, 1)[0];
    } else {
      return null;
    }
  }

  return {
    getAll: getAllLocations,
    get: getLocation,
    find: findLocation,
    add: addLocation,
    remove: removeLocation,
    rawData: tripDetails,
    label: tripDetails.label,
    id: tripDetails.id
  }

}
