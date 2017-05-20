var Parameters = Util.deepFreeze({
  categories: [{
      label: 'Landscape',
      name: 'landscape',
      icon: 'terrain'
    },
    {
      label: 'Nature',
      name: 'nature',
      icon: 'nature'
    },
    {
      label: 'Restaurant/Bar',
      name: 'dining',
      icon: 'local_dining'
    },
    {
      label: 'Building',
      name: 'building',
      icon: 'account_balance'
    },
    {
      label: 'Animal',
      name: 'animal',
      icon: 'pets'
    },
    {
      label: 'Sport',
      name: 'sport',
      icon: 'directions_bike'
    },
  ],
  storage: Object.freeze({
    tripList: "tripList",
    maxTripId: "maxTripId",
    lastActiveTrip: "lastActiveTrip"
  })

})
