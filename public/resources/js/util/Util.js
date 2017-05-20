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
      return (obj.id == id)
    })
  }

  return {
    getCategoryIcon: getCategoryIcon,
    getDateTimeString: getDateTimeString,
    getUniqueArray: getUniqueArray,
    findIdInArray: findIdInArray
  }
})()
