//var geolib = require('geolib')
var distance = require('google-distance');

//function calDistance(lat1, lon1, lat2, lon2, unit) {
//    distance.get(
//{
//    index: 1,
//    origin: lat1,-122.423771',
//    destination: '37.871601,-122.269104'
//},
//function (err, data) {
//    if (err) return console.log(err);

//    return data.distance.replace("km","");

//    //  console.log(data);
//});
//}
function lineDistance(point1, point2) {
    var xs = 0;
    var ys = 0;

    xs = point2[0] - point1[0];
    xs = xs * xs;

    ys = point2[1] - point1[1];
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}
function getDistances (cuslocations) {
  // test case

  var arrCustomerLocs = []

  for (var i = 0; i < cuslocations.length; i++) {
    var cusLA = cuslocations[i]
    var arrCusCL = []

    for (var j = 0; j < cuslocations.length; j++) {
      var cusLB = cuslocations[j]

        var reDCal = 1000;
      //var distance = geolib.getDistance(
      //    { latitude: cusLA[0], longitude: cusLA[1]},
      //    { latitude: cusLB[0], longitude: cusLB[1]}
        //  ) / reDCal;

        var distance = lineDistance(cusLA, cusLB);

      if (i !== j) {
          arrCusCL.push(distance);
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
      //var distance = geolib.getDistance(
      //    { latitude: depotL[0], longitude: depotL[1]},
      //    { latitude: cusLB[0], longitude: cusLB[1]}
        //  ) / reDCal;

      var distance = lineDistance(depotL, cusLB);

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
