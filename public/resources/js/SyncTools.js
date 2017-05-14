var SyncTools = (function(){
function getNeededActions(localTrips, serverTrips, lastSyncDate) {
  var date = lastSyncDate || new Date("2000-01-01 00:00:00");

  //Step 1: Filter out those that haven't been updated since the last sync date
  var localModifiedSinceDate = getTripsModifiedSince(localTrips, date);
  //Can't apply same to trips from server since they can be older than the last sync date but non-existent on current device
  var serverModifiedSinceDate = serverTrips;//getTripsModifiedSince(serverTrips, date);

  //Step 2: Find the trips that need to be uploaded/downloaded based on ID
  var toUpload = diffTripsMoreRecent(localModifiedSinceDate, serverModifiedSinceDate)
  var toDownload = diffTripsMoreRecent(serverModifiedSinceDate, localModifiedSinceDate)
  var toMerge = diffTripsEqual(serverModifiedSinceDate, localModifiedSinceDate)

  //Step3: Filter out the items that have the same modification date in upload/download

  console.log("Local trips: ", localTrips);
  console.log("Server trips: ", serverTrips);
  console.log("Last sync date: ", date);

  console.log("LocalModified: ",localModifiedSinceDate);
  console.log("ServerModified: ",serverModifiedSinceDate);

  console.log("Upload: ", toUpload);
  console.log("Download: ", toDownload);
  console.log("Merge: ", toMerge);

    console.log(diffTripsDate(toUpload, toDownload))
      console.log(diffTripsDate(toDownload, toUpload))

  return {
    toUpload: toUpload,
    toDownload: toDownload,
    toMerge: toMerge
  }

}

function findTripInArray(id, array){
  return array.filter(function(obj) {
    return (obj.id == id)
  }
}

// Filter out those where there is only either the same one or an older one
function diffTripsMoreRecent(a, b) {
  return a.filter(function(obj) {
    return !b.some(function(obj2) {
      return (obj.id == obj2.id)
    });
  });
};

function diffTripsEqual(a, b) {
  return a.filter(function(obj) {
    return b.some(function(obj2) {
      return (obj.id == obj2.id);
    });
  });
};

// Filter out those where there is only either the same one or an older one
function getTripsModifiedSince(trips, date) {
  return trips.filter(function(trip) {
    return (new Date(trip.lastEditTime).getTime() >= date.getTime());
  });
};

return {
  getNeededActions: getNeededActions
}

})()
