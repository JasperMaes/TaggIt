var GoogleDrive = (function() {
  var createAppDataFile = function(fileName) {
    return gapi.client.drive.files
      .create({
        resource: {
          name: fileName,
          parents: ['appDataFolder']
        },
        fields: 'id'
      }).then(function(data) {
        return {
          fileId: data.result.id
        };
      });
  };

  var getAppDataFileContent = function(fileId) {
    return gapi.client.drive.files
      .get({
        fileId: fileId,
        // Download a file — files.get with alt=media file resource
        alt: 'media'
      }).then(function(data) {
        return {
          fileId: fileId,
          content: data.result
        };
      });
  };

  var deleteFile = function(fileId) {
    return gapi.client.request({
      path: '/drive/v3/files/' + fileId,
      method: 'DELETE'
    }).then(function(data) {
      return {
        fileId: fileId,
        deleted: (data.status === 204)
      };
    });
  };

  var saveAppData = function(fileId, appData) {
    return gapi.client.request({
      path: '/upload/drive/v3/files/' + fileId,
      method: 'PATCH',
      params: {
        uploadType: 'media'
      },
      body: JSON.stringify(appData)
    }).then(function(data) {
      return {
        fileId: fileId,
        fileName: data.result.name,
        kind: data.result.kind,
        mimeType: data.result.mimeType
      };
    });
  };

  //TODO: Add search query parameter: https://developers.google.com/drive/v3/reference/files/list
  function getAppDataFiles() {
    return gapi.client.drive.files.list({
      'spaces': 'appDataFolder',
      'fields': "files(id, name)"
    }).then(function(data) {
      var files = [];
      data.result.files.forEach(function(file) {
        var item = {
          fileId: file.id,
          fileName: file.name
        };
        files.push(item);
      });

      return files;
    });
  }

  function deleteAllFiles() {
    getAppDataFiles().then(function(files) {
      files.forEach(function(file) {
        deleteFile(file.id);
      });
    });
  }

  return {
    getAppDataFiles: getAppDataFiles,
    saveAppData: saveAppData,
    deleteFile: deleteFile,
    getAppDataFileContent: getAppDataFileContent,
    createAppDataFile: createAppDataFile,
    deleteAllFiles: deleteAllFiles
  };

})();