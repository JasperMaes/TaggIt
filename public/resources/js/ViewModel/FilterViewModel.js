var FilterViewModel = function(tripViewModel) {
  var searchTerm = ko.observable("");
  var titleTerm = ko.observable("");
  var categoryTerm = ko.observable("");
  var descriptionTerm = ko.observable("");
  var isAdvancedFilterOpen = ko.observable(false);

  function search() {
    var filterOptions = {};
    if (isAdvancedFilterOpen()) {
      if (!!titleTerm() && titleTerm().length) {
        filterOptions.title = titleTerm();
      }
      if (!!categoryTerm() && categoryTerm().length) {
        filterOptions.category = categoryTerm();
      }
      if (!!descriptionTerm() && descriptionTerm().length) {
        filterOptions.description = descriptionTerm();
      }
    } else {
      if (!!searchTerm() && searchTerm().length) {
        filterOptions.title = searchTerm();
      }
    }
    tripViewModel.currentTrip().filter(filterOptions);
  }

  function toggleAdvancedFilter() {
    isAdvancedFilterOpen(!isAdvancedFilterOpen());
  }

  return {
    isAdvancedFilterOpen: isAdvancedFilterOpen,
    searchTerm: searchTerm,
    titleTerm: titleTerm,
    categoryTerm: categoryTerm,
    descriptionTerm: descriptionTerm,
    search: search,
    toggleAdvancedFilter: toggleAdvancedFilter
  };
};