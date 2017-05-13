var AddLocationController = function(tripViewModel){

  var locationData = {
    category: ko.observable(),
    title: ko.observable(),
    description: ko.observable(),
    website: ko.observable(),
    images: ko.observableArray([])
  };

  function getMapPreviewPanel(event){
    return $(event.target).parent().siblings(".mapPreview")
  }

  var imagePreviewController = ImagePreviewController(locationData);

  function clearForm(){
    locationData.title(null);
    locationData.description(null);
    locationData.website(null);
    locationData.category(null);
    locationData.position = null;
    locationData.images([])
  }

  function backToMap() {
    showPage("mapView");
    // Reset entered data
    clearForm();
  }

  function savePosition() {
    var location = ko.toJS(locationData);
    location.createTime = new Date();
    location.editTime = null;

    var trip = tripViewModel.currentTrip();
    trip.add(location);
    tripViewModel.currentTrip(trip)

    // TODO show short popup that disappears automatically to inform user
  }

  var addLocationController = {
    locationData: locationData,
    selectCategory: function(category, event) {
      locationData.category(category.name);
      showPage("addLocationDetailsView");
    },

    mapPreviewController: MapPreviewController(locationData, getMapPreviewPanel),
    savePosition: savePosition,
    savePositionAddNew: function(controller){
      savePosition();
      showPage("addLocationView");
      clearForm();
      controller.mapController.addMarkerHandler()
    },
    savePositionBackToMap: function(){
      savePosition();
      backToMap();
    },
    backToMap: backToMap,
    addImage: function(data, event) {
      var file = event.target.files[0]; //sames as here

      if (file.type.match("image/*")) {
        var reader = new FileReader();

        reader.onerror = function() {
          //TODO show message to inform user
          console.log("failed loading file")
        }

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
        }

        if (file) {
          reader.readAsDataURL(file); //reads the data as a URL
        } else {
          //TODO show message to inform user
          console.log("failed loading file")
        }
      } else {
        //TODO show message to inform user
        console.log("Not an image file, not uploading");
      }

      event.target.value = "";
    },
    backToSelectCategory: function() {
      showPage("addLocationView");
    },
    imagePreview: imagePreviewController,
    openImage: function(data, event){
      console.log("Edit image")
      var index = locationData.images().indexOf(data)
      imagePreviewController.imageIndex(index);
    }
  }

  return addLocationController;
}
