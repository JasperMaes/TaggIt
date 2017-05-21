var AddLocationController = function(tripViewModel) {

  var locationData = {
    category: ko.observable(),
    title: ko.observable(),
    description: ko.observable(),
    website: ko.observable(),
    images: ko.observableArray([])
  };
  var imagePreviewController = ImagePreviewController(locationData);

  function getMapPreviewPanel(event) {
    return $(event.target).parent().siblings(".mapPreview");
  }

  var mapPreviewController = PreviewPanel(locationData, getMapPreviewPanel, true);

  function clearForm() {
    locationData.title(null);
    locationData.description(null);
    locationData.website(null);
    locationData.category(null);
    locationData.position = null;
    locationData.images([]);
  }

  function backToMap(controller) {
    controller.showPage("mapView");
    clearForm();
  }

  function savePosition() {
    var location = ko.toJS(locationData);
    location.createTime = new Date();
    location.editTime = null;

    var trip = tripViewModel.currentTrip();
    trip.add(location);
    tripViewModel.currentTrip(trip);
  }

  function selectCategory(controller) {
    return function(category, event) {
      locationData.category(category.name);
      controller.showPage("addLocationDetailsView");
    };
  }

  function savePositionAddNew(controller) {
    savePosition();
    controller.showPage("addLocationView");
    clearForm();
    controller.mapController.addMarkerHandler(controller);
  }

  function savePositionBackToMap(controller) {
    savePosition();
    backToMap(controller);
  }

  function addImage(data, event) {
    var file = event.target.files[0]; //sames as here

    if (file.type.match("image/*")) {
      var reader = new FileReader();

      reader.onerror = function() {
        alert("Uploading image failed");
      };

      reader.onloadend = function() {
        var newImage = reader.result;
        var imagesArray = locationData.images();
        var arrayLength = imagesArray.length;
        for (var i = 0; i < arrayLength; i++) {
          if (imagesArray[i] === newImage) {
            alert("This image has already been added.");
            return;
          }
        }
        locationData.images.push(newImage);
      };

      if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
      } else {
        alert("Uploading image failed");
      }
    } else {
      alert("This is not an image file, it can't be uploaded");
    }

    event.target.value = "";
  }

  function openImage(data, event) {
    var index = locationData.images().indexOf(data);
    imagePreviewController.imageIndex(index);
  }

  var addLocationController = {
    locationData: locationData,
    mapPreviewController: mapPreviewController,
    savePosition: savePosition,
    selectCategory: selectCategory,
    savePositionAddNew: savePositionAddNew,
    savePositionBackToMap: savePositionBackToMap,
    backToMap: backToMap,
    addImage: addImage,
    backToSelectCategory: function(controller) {
      controller.showPage("addLocationView");
    },
    imagePreview: imagePreviewController,
    openImage: openImage
  };

  return addLocationController;
};
