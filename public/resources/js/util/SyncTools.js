var SyncTools = (function() {

  var lastSyncDate = ko.observable();
  var isSyncing = ko.observable(false);

  function getNeededActions(localTrips, serverTrips, lastSyncDate) {
    lastSyncDate = lastSyncDate || new Date("2000-01-01 00:00:00");

    //Step 1: Filter out those that haven't been updated since the last sync date
    var localModifiedSinceDate = getTripsModifiedSince(localTrips, lastSyncDate);
    //Can't apply same to trips from server since they can be older than the last sync date but non-existent on current device
    var serverModifiedSinceDate = serverTrips; //getTripsModifiedSince(serverTrips, date);

    //Step 2: Compare the arrays to find those to upload, download or merge
    var toUpload = [];
    var toDownload = [];
    var toMerge = [];
    localModifiedSinceDate.forEach(function(localTrip) {
      var localTripMatches = findTripInArray(localTrip.id, serverTrips);
      if (localTripMatches.length === 0) {
        toUpload.push(localTrip);
      } else {
        var serverTrip = localTripMatches[0];
        if ((new Date(serverTrip.lastEditTime).getTime() > lastSyncDate.getTime()) &&
          (new Date(localTrip.lastEditTime).getTime() > lastSyncDate.getTime())) {
          toMerge.push(localTrip)
        } else if (new Date(localTrip.lastEditTime).getTime() > new Date(serverTrip.lastEditTime).getTime()) {
          toUpload.push(localTrip);
        }
      }
    })

    serverTrips.forEach(function(serverTrip) {
      var serverTripMatches = findTripInArray(serverTrip.id, localTrips);
      if (serverTripMatches.length === 0) {
        toDownload.push(serverTrip);
      } else {
        var localTrip = serverTripMatches[0];
        if ((new Date(serverTrip.lastEditTime).getTime() > lastSyncDate.getTime()) &&
          (new Date(localTrip.lastEditTime).getTime() > lastSyncDate.getTime())) {
          toMerge.push(localTrip)
        } else if (new Date(serverTrip.lastEditTime).getTime() > new Date(localTrip.lastEditTime).getTime()) {
          toDownload.push(localTrip);
        }
      }
    })

    // Step 3: Remove duplicates from the to merge array since they can be added twice
    toMerge = getUniqueArray(toMerge, "id");
    /*
        console.log("Local trips: ", localTrips);
        console.log("Server trips: ", serverTrips);
        console.log("Last sync date: ", lastSyncDate);

        console.log("Upload: ", toUpload);
        console.log("Download: ", toDownload);
        console.log("Merge: ", toMerge);
    */
    return {
      toUpload: toUpload,
      toDownload: toDownload,
      toMerge: toMerge
    }

  }

  function getUniqueArray(array, property) {
    var values = {};
    var result = array.filter(function(entry) {
      if (values[entry[property]]) {
        return false;
      }
      values[entry[property]] = true;
      return true;
    });
    return result;
  }

  function findTripInArray(id, array) {
    return array.filter(function(obj) {
      return (obj.id == id)
    })
  }

  // Filter out those where there is only either the same one or an older one
  function getTripsModifiedSince(trips, date) {
    return trips.filter(function(trip) {
      return (new Date(trip.lastEditTime).getTime() >= date.getTime());
    });
  };

  function syncComplete() {
    var date = new Date();
    return localforage.setItem("lastSyncDate", date)
      .then(function() {
        lastSyncDate(date);
        isSyncing(false);
        return Promise.resolve(date);
      });
  }

  function getLastSyncDate() {
    return localforage.getItem("lastSyncDate")
      .then(
        function(date) {
          lastSyncDate(date);
          return Promise.resolve(date)
        },
        function() {
          var date = new Date("2000-01-01 00:00");
          lastSyncDate(date);
          return Promise.resolve(date)
        }
      );
  }

  function getOrCreateFileId(fileName) {
    return GoogleDrive.getAppDataFiles()
      .then(function(files) {
        var result = $.grep(files, function(el) {
          return el.fileName === fileName
        })

        if (result.length === 0) {
          return Promise.reject("No index file found")
        } else {
          return Promise.resolve(result[0]);
        }
      }, console.log)
      .then(
        function(data) {
          return Promise.resolve(data)
        },
        function() {
          return GoogleDrive.createAppDataFile(fileName);
        }
      )
      .then(function(data) {
        return Promise.resolve(data.fileId)
      })
  }


  function handleUpload(tripsToUpload, serverTrips, listFileId, newMaxId) {
    if (tripsToUpload.length > 0) {
      var newTrips = serverTrips.concat(tripsToUpload)

      var newServerData = {
        maxTripId: newMaxId,
        trips: newTrips
      };
      var promises = []
      var updateTripListPromise = GoogleDrive.saveAppData(listFileId, newServerData)
      promises.push(updateTripListPromise);

      tripsToUpload.forEach(function(item) {
        var promise = TripModel.getTripDetails(item.id)
          .then(function(tripDetails) {
            var tripData = tripDetails._getRawData();
            return getOrCreateFileId(tripData.id + ".json")
              .then(function(fileId) {
                console.log(fileId);
                return GoogleDrive.saveAppData(fileId, tripData)
              })
          })
        promises.push(promise);
      })

      return Promise.all(promises);
    } else {
      return Promise.resolve(true);
    }
  }

  function handleDownload(tripsToDownload, newMaxId) {
    if (tripsToDownload.length > 0) {
      var promises = []
      var maxIdPromise = TripModel._setMaxTripId(newMaxId);
      promises.push(maxIdPromise)

      //For each trip to download: download file and call TripModel.addTripWithId
      tripsToDownload.forEach(function(item) {
        var promise = getOrCreateFileId(item.id + ".json")
          .then(function(fileId) {
            return GoogleDrive.getAppDataFileContent(fileId);
          })
          .then(function(data) {
            var tripDetails = data.content;
            tripDetails.createTime = new Date(tripDetails.createTime);
            tripDetails.editTime = new Date(tripDetails.editTime);
            return TripModel.addTripWithId(tripDetails);
          })
          .then(console.log)
        promises.push(promise)
      })

      return Promise.all(promises);
    } else {
      return Promise.resolve(true);
    }
  }

  function handleMerge(tripsToMerge, serverTrips, listFileId, newMaxId) {
    if (tripsToMerge.length > 0) {
      var promises = [];

      //For each trip to merge, ask for confirmation on to upload or download and perform that action
      tripsToMerge.forEach(function(item) {
        if (confirm("A conflict was detected while syncing \nPress OK to upload the local data to Google. Otherwse, the local data will be replaced.")) {
          promises.push(handleUpload([item], serverTrips, listFileId, newMaxId));
        } else {
          promises.push(handleDownload([item], newMaxId));
        }
      })

      return Promise.all(promises);
    } else {
      return Promise.resolve(true);
    }
  }

  function getTripList() {
    return TripModel.getTrips()
      .then(function(trips) {
        var promises = [];
        trips.forEach(function(trip) {
          var promise = TripModel.getTripDetails(trip.id)
            .then(function(tripDetails) {
              return {
                id: tripDetails.details.id,
                lastEditTime: (tripDetails.details.editTime || tripDetails.details.createTime).toISOString()
              }
            })
          promises.push(promise);
        })
        return Promise.all(promises)
      })
  }

  function triggerSync() {
    isSyncing(true);
    console.log("syncing")
    getOrCreateFileId("TripList.json")
      .then(function(fileId) {
        return Promise.all([GoogleDrive.getAppDataFileContent(fileId), getLastSyncDate()])
      }, console.log)
      .then(function(data) {
        console.log("TripList data: ", data[0])

        var localMaxId = TripModel._getMaxTripId();
        var fileId = data[0].fileId;
        var fileContent = data[0].content || {};
        var serverMaxId = fileContent.maxTripId || -1;
        var serverTrips = fileContent.trips || [];
        var lastSyncDate = data[1];

        return getTripList()
          .then(function(localTrips) {
            var neededActions = SyncTools.getNeededActions(localTrips, serverTrips, lastSyncDate);
            console.log("Needed actions: ", neededActions)

            var newMaxId = Math.max(localMaxId, serverMaxId)
            console.log("Max id: ", newMaxId)

            var uploadPromise = handleUpload(neededActions.toUpload, serverTrips, fileId, newMaxId);
            var downloadPromise = handleDownload(neededActions.toDownload, newMaxId);
            var mergePromise = handleMerge(neededActions.toMerge, serverTrips, fileId, newMaxId)

            return Promise.all([uploadPromise, downloadPromise, mergePromise])
          })
          .then(function() {
            console.log("complete")
            return syncComplete();
          });
      })
  }


  function removeAutoSync(controller) {
    controller.isOnline(false);
    window.removeEventListener('online', addAutoSync);
    if (!!syncTimer) {
      clearInterval(timer);
      syncTimer = null;
    }
  }

  var syncTimer = null;

  function addAutoSync(controller) {
    controller.isOnline(true);
    var triggerFunc = function() {
      SyncTools.triggerSync()
    }
    // Sync every 15 minutes
    timer = setInterval(triggerFunc, 15 * 60 * 1000)
  }

  return {
    getNeededActions: getNeededActions,
    syncComplete: syncComplete,
    getLastSyncDate: getLastSyncDate,
    triggerSync: triggerSync,
    lastSyncDate: lastSyncDate,
    isSyncing: isSyncing,
    removeAutoSync: removeAutoSync,
    addAutoSync: addAutoSync
  }

})()
