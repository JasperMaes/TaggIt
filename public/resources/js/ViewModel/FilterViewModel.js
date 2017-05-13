var FilterViewModel = function() {
  var searchTerm = ko.observable("");

  function search() {
    console.log(searchTerm())
    tripViewModel.currentTrip().filter({
      title: searchTerm()
    });
  }

  return {
    searchTerm: searchTerm,
    search: search
  }
}
