var AddLocationController = function(){

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

  var addLocationController = {
    locationData: locationData,
    selectCategory: function(category) {
      return function() {
        controller.addLocationController.locationData.category(category);
        showPage("addLocationDetailsView");
      };
    },

    mapPreviewController: MapPreviewController(locationData, getMapPreviewPanel),
    savePosition: function() {
      var location = ko.toJS(controller.addLocationController.locationData)
      var currentdate = new Date();
      location.createTime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes();

      var trip = controller.tripViewModel.currentTrip();
      trip.add(location);
      controller.tripViewModel.currentTrip(trip)

      // TODO show short popup that disappears automatically to inform user
      controller.addLocationController.backToMap();
    },
    backToMap: function() {
      showPage("mapView");
      // Reset entered data
      controller.addLocationController.locationData.title(null);
      controller.addLocationController.locationData.description(null);
      controller.addLocationController.locationData.website(null);
      controller.addLocationController.locationData.category(null);
      controller.addLocationController.locationData.position = null;
      controller.addLocationController.locationData.images([])
    },
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
          var imagesArray = controller.addLocationController.locationData.images();
          var arrayLength = imagesArray.length;
          for (var i = 0; i < arrayLength; i++) {
            if (imagesArray[i] === newImage) {
              console.log("Image already uploaded");
              //TODO show popup message to confirm double upload
              return;
            }
          }
          controller.addLocationController.locationData.images.push(newImage);
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
      var index = controller.addLocationController.locationData.images().indexOf(data)
      imagePreviewController.imageIndex(index);
    }
  }

  return addLocationController;
}
