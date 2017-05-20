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

function prepend0IfLessThan10(value){
  if(value < 10){
    return "0"+value;
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

var Util = {
  getCategoryIcon: getCategoryIcon,
  getDateTimeString: getDateTimeString
}
