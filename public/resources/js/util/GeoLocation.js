/**
 * @file Wrapper for the GeoLocation API to work using promises
 * @author Jasper Maes
 */
var GeoLocation = (function() {
  /**
   * Get the current location
   *
   * @returns {promise} Resolves to the output of navigator.geolocation.getCurrentPosition
   */
  function getPreciseLocation() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 0
      });
    });
  }

  /**
   * Watch the current location
   *
   * @returns {promise} Resolves to the output of navigator.geolocation.watchPosition
   */
  function watchLocation(successCallBack, errorCallBack) {
    return navigator.geolocation.watchPosition(successCallBack, errorCallBack || printError, {
      enableHighAccuracy: true,
      maximumAge: 0
    });
  }

  /**
   * Unregister watch handler
   *
   * @returns {promise} Resolves to the output of navigator.geolocation.watchPosition
   */
  function clearWatch(watchId) {
    return navigator.geolocation.clearWatch(watchId);
  }

  function printError(error) {
    switch (error.code) {
      //TODO convert to message objects
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.")
        break;
    }
  }

  return {
    get: getPreciseLocation,
    watch: watchLocation,
    clearWatch: clearWatch,
    isSupported: (!!navigator.geolocation),
    printError: printError
  }
})()
