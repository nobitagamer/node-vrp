var http = require('http')
var Stork = require('../stork')

var utils = require('../lib/utils');


var customer_locations =  [
  [
            43, 
            19
        ], 
        [
            79, 
            35
        ], 
        [
            93, 
            7
        ], 
        [
            13, 
            35
        ], 
        [
            67, 
            13
        ], 
        [
            31, 
            77
        ], 
        [
            81, 
            7
        ], 
        [
            27, 
            49
        ], 
        [
            27, 
            35
        ], 
        [
            69, 
            23
        ], 
        [
            31, 
            51
        ], 
        [
            27, 
            27
        ], 
        [
            15, 
            83
        ], 
        [
            7, 
            35
        ], 
        [
            53, 
            25
        ], 
        [
            75, 
            13
        ], 
        [
            47, 
            49
        ], 
        [
            25, 
            33
        ], 
        [
            1, 
            23
        ], 
        [
            45, 
            11
        ], 
        [
            1, 
            47
        ], 
        [
            93, 
            15
        ], 
        [
            41, 
            9
        ], 
        [
            75, 
            55
        ], 
        [
            3, 
            1
        ], 
        [
            51, 
            67
        ], 
        [
            57, 
            91
        ], 
        [
            21, 
            97
        ], 
        [
            55, 
            13
        ], 
        [
            3, 
            71
        ], 
        [
            37, 
            19
        ], 
        [
            73, 
            21
        ], 
        [
            19, 
            19
        ], 
        [
            75, 
            73
        ], 
        [
            93, 
            49
        ], 
        [
            41, 
            87
        ], 
        [
            97, 
            73
        ], 
        [
            45, 
            29
        ]
    ];
var depot =[ [
    1,
    -1
]];

//console.log(utils.getDistances(customer_locations));
//console.log(utils.getDepotDistances(depot, customer_locations));


var testCases = [
  {
    numWorkers: 3,
    maxRouteLength: 20,
    customers: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ],
    verbose: false,
    distances: [
      [ 0, 10, 9, 2, 4, 3, 3, 10, 8 ],
      [ 10, 0, 2, 10, 9, 8, 9, 2, 4 ],
      [ 9, 2, 0, 8, 5, 6, 6, 3, 4 ],
      [ 2, 10, 8, 0, 2, 4, 2, 8, 5 ],
      [ 4, 9, 5, 2, 0, 5, 2, 7, 6 ],
      [ 3, 8, 6, 4, 5, 0, 6, 4, 2 ],
      [ 3, 9, 6, 2, 2, 6, 0, 9, 7 ],
      [ 10, 2, 3, 8, 7, 4, 9, 0, 3 ],
      [ 8, 4, 4, 5, 6, 2, 7, 3, 0 ]
    ],
    depot: [ 3, 3, 3, 3, 2, 3, 3, 4, 3 ]
  },

  { numWorkers: 3,
    customers: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ],
    depotLoc: 'Waterloo, ON',
    maxRouteLength: 20000,
    lengthPenalty: 10,
    stability: 1000,
    verbose: false,
    distances: [
      [ 0, 3084, 2024, 1950, 2128, 799, 1541, 1260, 2103 ],
      [ 5639, 0, 1060, 3777, 3956, 2626, 3369, 3087, 4088 ],
      [ 3063, 1060, 0, 3336, 3514, 2185, 2927, 2646, 4394 ],
      [ 1318, 4402, 3342, 0, 476, 1151, 409, 1241, 3289 ],
      [ 1496, 4580, 3520, 476, 0, 1329, 587, 1420, 2813 ],
      [ 167, 3251, 2191, 1151, 1329, 0, 742, 461, 2270 ],
      [ 909, 3993, 2933, 409, 587, 742, 0, 833, 3012 ],
      [ 628, 3712, 2652, 1241, 1700, 461, 833, 0, 1807 ],
      [ 2009, 4532, 3472, 3273, 2797, 1882, 2625, 1790, 0 ]
    ],
    depot: [ 3314, 3360, 2300, 1420, 1840, 2515, 1773, 2606, 4035 ]
  }

]

// start the app
new Stork({ port: 8080 }).start()

var reqOpts = {
  host: '127.0.0.1',
  port: 8080,
  path: '/solve',
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  }
}

testCases.forEach(function (opts) {
  var req = http.request(reqOpts, function (res) {
    var data = ''
    res.on('data', function (chunk) {
      data += chunk
    })
    res.on('end', function () {
      console.log('client got', data)
    })
  })
  req.on('error', function (err) {
    console.log('http client request error:', err)
  })
  console.log('opts', JSON.stringify(opts))
  req.end(JSON.stringify(opts))

// console.log('\nelapsed time: %s ms. Cost: %s', result.elapsed, result.cost)
// console.log('solution:', result.solution)
})
