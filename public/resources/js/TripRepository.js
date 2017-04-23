var TripRepository = (function(){

function getTrips(){
  return ["trip1","trip2","trip3"];
}

function getTripDetails(tripId){
  return {
    id: "trip1",
    label: "Trip 1",
    locations: [
      {id:"trip1-1",label:"Location 1",latitude: 50.939343499999995, longitude:4.3371832},
      {id:"trip1-2",label:"Location 2",latitude: 50.939343499999995, longitude:4.3331832}
    ]
  }
}

return {
  getTrips: getTrips,
  getTripDetails: getTripDetails
}

})()
