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

var Util = {
  getCategoryIcon: getCategoryIcon
}
