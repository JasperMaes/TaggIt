var GoogleSignin = (function() {
  // Client ID and API key from the Developer Console
  var CLIENT_ID = '59941244194-uf40ssn9jm0fehvpj1eb6o7tn0o9jqbb.apps.googleusercontent.com';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = 'https://www.googleapis.com/auth/drive.appfolder';

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  function load(callback) {
    return new Promise(function(resolve, reject) {
      gapi.load('client:auth2', resolve);
    });
  }

  /**
   *  Sign in the user upon button click.
   */
  function signIn(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function signOut(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  function init() {
    return gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    });
  }

  return {
    load: load,
    signIn: signIn,
    signOut: signOut,
    init: init
  };

})();
