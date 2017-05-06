var AddLocationController = function(){
  var addLocationController = {
    categories: [{
        name: 'landscape',
        icon: 'terrain'
      },
      {
        name: 'nature',
        icon: 'nature'
      },
      {
        name: 'dining',
        icon: 'local_dining'
      },
      {
        name: 'building',
        icon: 'account_balance'
      },
      {
        name: 'animal',
        icon: 'pets'
      },
      {
        name: 'sport',
        icon: 'directions_bike'
      },
    ], //, 'nature', 'dining', 'building', 'animal', 'sport'
    locationData: {
      category: ko.observable(),
      title: ko.observable(),
      description: ko.observable(),
      website: ko.observable(),
      images: ko.observableArray([])
    },
    getCategoryIcon: function(category) {
      var result = "home";
      controller.addLocationController.categories.forEach(function(value) {
        if (value.name === category) {
          result = value.icon;
        }
      });
      if (result === "home") {
        console.error("Unknown category, no icon defined");
      }
      return result;
    },
    selectCategory: function(category) {
      return function() {
        controller.addLocationController.locationData.category(category);
        showPage("addLocationDetailsView");
      };
    },
    selectCategoryClosePanel: function(category) {
      return function() {
        controller.addLocationController.locationData.category(category);
        $("#changeCategoryCollapse").collapse('toggle');
      };
    },
    openPanelHandler: function() {
      var $this = $(this);
      $("[data-collapse-group='myDivs']:not([data-target='" + $this.data("target") + "'])").each(function() {
        $($(this).data("target")).collapse("hide");
      });
    },
    openMapPreviewHandler: function() {
      setTimeout(function() { //Needs a little timeout to have the correct width of the panel
        var panel = $("#mapPreview div.panel-body");
        var width = panel.width();
        var height = 0.75 * width;
        var lat = controller.addLocationController.locationData.position[0];
        var lng = controller.addLocationController.locationData.position[1];
        var imageUrl = "http://staticmap.openstreetmap.de/staticmap.php?center=" + lat + "," + lng + "&zoom=16&size=" + width + "x" + height + "&maptype=mapnik"
        panel.find("#frame")
          .css('background-image', 'url(' + imageUrl + ')')
          .css('height', height);
      }, 50)
      controller.addLocationController.openPanelHandler.call(this);
    },
    savePosition: function() {
      // TODO add data validation + encoding (website valid address, texts are html encoded)
      // TODO save position logic
      console.log("Add functionality to save position");
      var location = ko.toJS(controller.addLocationController.locationData)
      console.log(location)
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
    }
  }

  return addLocationController;
}
