var http = require('http')
var Stork = require('../stork')

var utils = require('../lib/utils')

var customerLocations = [
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
  ]
  /*,
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
  ]*/
]
var depot = [
    [
        1,
        -1
    ]
];
var customer_demands = [
    5,
    24,
    3,
    20,
    26,
    23,
    15,
    3,
    20,
    16,
    9,
    21,
    3,
    24,
    14,
    6,
    6,
    13,
    5,
    3,
    3,
    20,
    16,
    22,
    10,
    12,
    20,
    24,
    6,
    1,
    2,
    13,
    7,
    6,
    24,
    19,
    4,
    7
];


console.log(utils.getDistances(customerLocations));
// console.log(utils.getDepotDistances(depot, customerLocations))
//console.log("Total worker:" + utils.getMinWorkers(100, customer_demands));

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

// testCases.forEach(function (opts) {
//   var req = http.request(reqOpts, function (res) {
//     var data = ''
//     res.on('data', function (chunk) {
//       data += chunk
//     })
//     res.on('end', function () {
//       console.log('client got', data)
//     })
//   })
//   req.on('error', function (err) {
//     console.log('http client request error:', err)
//   })
//   console.log('opts', JSON.stringify(opts))
//   req.end(JSON.stringify(opts))

// // console.log('\nelapsed time: %s ms. Cost: %s', result.elapsed, result.cost)
// // console.log('solution:', result.solution)
// })

var mdcTestCases = [
  {
    'problem_data': {
      'vehicle_capacity': 100,
      'depots': [
        [
          1,
          -1
        ]
      ],
      'customer_demands': [
        23,
        3,
        24,
        15,
        15,
        24,
        7,
        25,
        13,
        5,
        7,
        5,
        14,
        13,
        5,
        24,
        15,
        9,
        16,
        13,
        16,
        13,
        24,
        20,
        23,
        20,
        3,
        15,
        12,
        19,
        4,
        15,
        1
      ],
      'customer_locations': [
        [
          67,
          91
        ],
        [
          39,
          21
        ],
        [
          3,
          9
        ],
        [
          97,
          15
        ],
        [
          91,
          65
        ],
        [
          55,
          75
        ],
        [
          55,
          71
        ],
        [
          57,
          85
        ],
        [
          21,
          15
        ],
        [
          47,
          57
        ],
        [
          51,
          97
        ],
        [
          11,
          11
        ],
        [
          43,
          59
        ],
        [
          63,
          69
        ],
        [
          55,
          77
        ],
        [
          35,
          11
        ],
        [
          27,
          91
        ],
        [
          49,
          25
        ],
        [
          29,
          93
        ],
        [
          71,
          27
        ],
        [
          31,
          43
        ],
        [
          27,
          9
        ],
        [
          67,
          99
        ],
        [
          87,
          81
        ],
        [
          23,
          81
        ],
        [
          89,
          33
        ],
        [
          71,
          91
        ],
        [
          19,
          77
        ],
        [
          65,
          77
        ],
        [
          87,
          79
        ],
        [
          19,
          83
        ],
        [
          1,
          59
        ],
        [
          55,
          7
        ]
      ]
    }
  }
]

var mdcReqOpts = {
  host: '127.0.0.1',
  port: 8080,
  path: '/mdcvrp',
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  }
}

//mdcTestCases.forEach(function (opts) {
//  var req = http.request(mdcReqOpts, function (res) {
//    var data = ''
//    res.on('data', function (chunk) {
//      data += chunk
//    })
//    res.on('end', function () {
//      console.log('client got', data)
//    })
//  })
//  req.on('error', function (err) {
//    console.log('http client request error:', err)
//  })
//  console.log('opts', JSON.stringify(opts))
//  req.end(JSON.stringify(opts))

//// console.log('\nelapsed time: %s ms. Cost: %s', result.elapsed, result.cost)
//// console.log('solution:', result.solution)
//})
