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

function getDateTimeString(currentDate) {
  currentDate = currentDate || new Date();
  if (typeof currentDate === "string") {
    return currentDate;
  } else {
    return currentDate.getDate() + "/" +
      (currentDate.getMonth() + 1) + "/" +
      currentDate.getFullYear() + " " +
      currentDate.getHours() + ":" +
      currentDate.getMinutes();
  }
}

var Util = {
  getCategoryIcon: getCategoryIcon,
  getDateTimeString: getDateTimeString
}
