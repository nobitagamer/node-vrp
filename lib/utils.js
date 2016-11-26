var geolib = require('geolib')

function getDistances (cuslocations) {
  // test case

  var arrCustomerLocs = []

  for (var i = 0; i < cuslocations.length; i++) {
    var cusLA = cuslocations[i]
    var arrCusCL = []

    for (var j = 0; j < cuslocations.length; j++) {
      var cusLB = cuslocations[j]

      var reDCal = 1000000
      var distance = geolib.getDistance(
          { latitude: cusLA[0], longitude: cusLA[1]},
          { latitude: cusLB[0], longitude: cusLB[1]}
        ) / reDCal
      if (i !== j) {
        arrCusCL.push(distance)
      }
      // console.log(arrCusCL)
      arrCustomerLocs.push(arrCusCL)
    }
  }

  return arrCustomerLocs
}

function getDepotDistances (depots, cuslocations) {
  // test case

  var arrCustomerLocs = []

  for (var i = 0; i < depots.length; i++) {
    var depotL = depots[i]
    var arrDepotsCL = []

    for (var j = 0; j < cuslocations.length; j++) {
      var cusLB = cuslocations[j]

      var reDCal = 1000000
      var distance = geolib.getDistance(
          { latitude: depotL[0], longitude: depotL[1]},
          { latitude: cusLB[0], longitude: cusLB[1]}
        ) / reDCal
      if (i !== j) {
        arrDepotsCL.push(distance)
      }
      // console.log(arrCusCL)
      arrCustomerLocs.push(arrDepotsCL)
    }
  }

  return arrCustomerLocs
}

function getMinWorkers (capacity, demands) {

    var numWorker = 0;

    var totalDemands = demands.reduce(function(a, b) {
        return a + b;
    }, 0);

    var numWorker = Math.ceil(totalDemands / capacity);

    //console.log("Total:" + argVal);

    return numWorker;
}

module.exports = {
  getDistances: getDistances,
  getDepotDistances: getDepotDistances,
  getMinWorkers: getMinWorkers
}
