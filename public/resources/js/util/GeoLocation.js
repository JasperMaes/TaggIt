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
    var errorMessage = Message.GeoLocationUnknownError;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = Message.GeoLocationPermissionDenied;
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = Message.GeoLocationPositionUnavailable;
        break;
      case error.TIMEOUT:
        errorMessage = Message.GeoLocationTimeout;
        break;
      case error.UNKNOWN_ERROR:
        errorMessage = Message.GeoLocationUnknownError;
        break;
    }
    console.log(errorMessage.id + " - " + errorMessage.message);
  }

  return {
    get: getPreciseLocation,
    watch: watchLocation,
    clearWatch: clearWatch,
    isSupported: (!!navigator.geolocation),
    printError: printError
  };
})();