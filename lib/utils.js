var geolib = require('geolib')
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

    return Math.round(Math.sqrt(xs + ys));
}
function getDistances (cuslocations) {
  // test case

  var arrCustomerLocs = []

  for (var i = 0; i < cuslocations.length; i++) {
    var cusLA = cuslocations[i]
    var arrCusCL = []

    for (var j = 0; j < cuslocations.length; j++) {
        var cusLB = cuslocations[j];

        var reDCal = 1000000;
      //var distance = geolib.getDistance(
      //    { latitude: cusLA[0], longitude: cusLA[1]},
      //    { latitude: cusLB[0], longitude: cusLB[1]}
      //    ) / reDCal;

       var distance = lineDistance(cusLA, cusLB);

     
          arrCusCL.push(Math.round(distance));
      
      // console.log(arrCusCL)
       
    }
    arrCustomerLocs.push(arrCusCL);
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

        var reDCal = 1000000;
      //var distance = geolib.getDistance(
      //    { latitude: depotL[0], longitude: depotL[1]},
      //    { latitude: cusLB[0], longitude: cusLB[1]}
      //    ) / reDCal;

      var distance = lineDistance(depotL, cusLB);

      
          arrDepotsCL.push((distance));
  
      // console.log(arrCusCL)
     
    }
      arrCustomerLocs.push(arrDepotsCL);
  }

  return arrCustomerLocs
}

function getMinWorkers (capacity, demands) {

    var numWorker = 1;

    //var totalDemands = demands.reduce(function(a, b) {
    //    return a + b;
    //}, 0);

    //var numWorker = Math.ceil(totalDemands / capacity);
    var carryCap = 0;
    for (var i = 0; i < demands.length; i++) {
        var demandItem = demands[i];
        console.log("case: " + demandItem);
        carryCap += demandItem;
        if (carryCap >= capacity) {
            carryCap -= demandItem;
                console.log(carryCap);
                ++numWorker;
                carryCap = 0;
            }
       
        
    }



    return numWorker;
}

module.exports = {
  getDistances: getDistances,
  getDepotDistances: getDepotDistances,
  getMinWorkers: getMinWorkers
}
