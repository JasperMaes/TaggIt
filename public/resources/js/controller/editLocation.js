var EditLocationController = function(tripViewModel) {

  var locationData = {
    id: null,
    category: ko.observable(),
    title: ko.observable(),
    description: ko.observable(),
    website: ko.observable(),
    images: ko.observableArray([]),
    position: ko.observableArray([]),
    createTime: null,
    editTime: null
  };

  function setLocationData(data) {
    locationData.id = data.id;
    locationData.category(data.category);
    locationData.title(data.title);
    locationData.description(data.description);
    locationData.website(data.website);
    locationData.images(data.images);
    locationData.position(data.position);
    locationData.createTime = data.createTime;
    locationData.editTime = data.editTime;
  }

  var imagePreviewController = ImagePreviewController(locationData);

  function clearForm() {
    locationData.id = null;
    locationData.title(null);
    locationData.description(null);
    locationData.website(null);
    locationData.category(null);
    locationData.position();
    locationData.images([]);
    locationData.createTime = null;
  }

  function backToViewLocation(controller) {
    controller.showPage("viewLocationView");
    // Reset entered data
    clearForm();
  }

  function deleteLocation(controller){
    var result = confirm("Do you really want to delete the location?");
    if (result) {
      var trip = tripViewModel.currentTrip();
      trip.remove(locationData.id);
      tripViewModel.currentTrip(trip);
      controller.showPage("locationsListView");
    }
  }

  var openMapEdit = ko.observable(false);
  var invalidateSize = ko.observable(true);

  var mapController = {
    bounds: ko.observable(),
    markers: ko.observableArray([{
      center: [ko.observable(50.81057), ko.observable(4.93622)],
      draggable: true
    }]),
    center: [ko.observable(50.81057), ko.observable(4.93622)], //ko.computed(function(){return [ko.observable(locationData.position()[0]), ko.observable(locationData.position()[1])]})
    invalidateSize: invalidateSize,
    mapOptions: {
      zoomControl: false
    },
    zoom: 16
  };

  var editLocationController = {
    locationData: locationData,
    openMapEdit: openMapEdit,
    openMapEditHandler: function() {
      openMapEdit(true);
      //Set map center
      mapController.center[0](locationData.position()[0]);
      mapController.center[1](locationData.position()[1]);
      //Set center marker position
      mapController.markers()[0].center[0](locationData.position()[0]);
      mapController.markers()[0].center[1](locationData.position()[1]);
      invalidateSize(!invalidateSize());
    },
    closeMapEditHandler: function() {
      openMapEdit(false);
    },
    saveMapEditHandler: function() {
      var newPosition = ko.toJS(mapController.markers()[0].center);
      locationData.position(newPosition);
      openMapEdit(false);
    },
    mapController: mapController,
    mapPreviewController: MapPreviewController(locationData, function() {}),
    backToViewLocation: backToViewLocation,
    saveEditsBackToView: function(controller) {
      locationData.editTime = new Date();
      var locationDataJS = ko.toJS(locationData);
      controller.viewLocationController.locationData(locationDataJS);

      var trip = tripViewModel.currentTrip();
      trip.update(locationDataJS);
      tripViewModel.currentTrip(trip);

      backToViewLocation(controller);
    },
    addImage: function(data, event) {
      var file = event.target.files[0]; //sames as here

      if (file.type.match("image/*")) {
        var reader = new FileReader();

        reader.onerror = function() {
          //TODO show message to inform user
          console.log("failed loading file");
        };

        reader.onloadend = function() {
          var newImage = reader.result;
          var imagesArray = locationData.images();
          var arrayLength = imagesArray.length;
          for (var i = 0; i < arrayLength; i++) {
            if (imagesArray[i] === newImage) {
              console.log("Image already uploaded");
              //TODO show popup message to confirm double upload
              return;
            }
          }
          locationData.images.push(newImage);
          //TODO show short popup that disappears automatically to inform user
        };

        if (file) {
          reader.readAsDataURL(file); //reads the data as a URL
        } else {
          //TODO show message to inform user
          console.log("failed loading file");
        }
      } else {
        //TODO show message to inform user
        console.log("Not an image file, not uploading");
      }

      event.target.value = "";
    },
    imagePreview: imagePreviewController,
    openImage: function(data, event) {
      var index = locationData.images().indexOf(data);
      imagePreviewController.imageIndex(index);
    },
    setLocationData: setLocationData,
    deleteLocation: deleteLocation
  };

  return editLocationController;
};
