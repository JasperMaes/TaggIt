var Util = (function() {
  function getCategoryIcon(category) {
    var result = "---";
    Parameters.categories.forEach(function(value) {
      if (value.name === category) {
        result = value.icon;
      }
    });
    if (result === "---") {
      console.error("Unknown category, no icon defined");
    }
    return result;
  }

  function prepend0IfLessThan10(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }

  function getDateTimeString(currentDate) {
    currentDate = currentDate || new Date();
    if (typeof currentDate === "string") {
      return currentDate;
    } else {
      return prepend0IfLessThan10(currentDate.getDate()) + "/" +
        prepend0IfLessThan10((currentDate.getMonth() + 1)) + "/" +
        currentDate.getFullYear() + " " +
        prepend0IfLessThan10(currentDate.getHours()) + ":" +
        prepend0IfLessThan10(currentDate.getMinutes());
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

  function findIdInArray(id, array) {
    return array.filter(function(obj) {
      return (obj.id == id);
    });
  }

  // ONLY works for strings!
  function compareObjectParameters(parameters) {
    return function(object) {
      var objectMatches = Object.keys(parameters).every(function(key, index, array) {
        if (object.hasOwnProperty(key)) {
          var objectValue = object[key];
          var paramValue = parameters[key] || "";
          return (objectValue !== null) && (objectValue !== undefined) && (objectValue.toUpperCase().match(paramValue.toUpperCase()));
        } else {
          return true;
        }
      });
      return objectMatches;
    };
  }

  // Make objects immutable
  // TODO deepFreeze can be replaced with 'const' when using ES6
  function deepFreeze(obj) {

    // Retrieve the property names defined on obj
    var propNames = Object.getOwnPropertyNames(obj);

    // Freeze properties before freezing self
    propNames.forEach(function(name) {
      var prop = obj[name];

      // Freeze prop if it is an object
      if (typeof prop == 'object' && prop !== null)
        deepFreeze(prop);
    });

    // Freeze self (no-op if already frozen)
    return Object.freeze(obj);
  }

  return {
    getCategoryIcon: getCategoryIcon,
    getDateTimeString: getDateTimeString,
    getUniqueArray: getUniqueArray,
    findIdInArray: findIdInArray,
    compareObjectParameters: compareObjectParameters,
    deepFreeze: deepFreeze
  };
})();
