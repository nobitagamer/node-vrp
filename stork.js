var path = require('path')
var express = require('express')
var Router = require('./router')
var utils = require('./lib/utils')

// Middlewares
var bodyParser = require('body-parser')
var errorhandler = require('errorhandler')

function Stork (opts) {
  this.opts = opts
  this.app = express()
  this.configure()
  this.registerRoutes()
}

module.exports = Stork

Stork.prototype.configure = function () {
  var app = this.app
  // becomes
  var env = process.env.NODE_ENV || 'development'
  if (env === 'development') {
    app.use(bodyParser.json())
    app.use(express.static(path.join(__dirname, '/public')))
    app.use(errorhandler({
      dumpExceptions: true,
      showStack: true
    }))
  }
}

Stork.prototype.registerRoutes = function () {
  // var self = this
  var app = this.app

  app.get('/', function (req, res) {
    res.sendfile(path.resolve(__dirname, 'views/map.html'))
  })

  app.post('/mdcvrp', function (req, res) {
    var input = req.body.problem_data
    // Request
    //     POST /mdcvrp HTTP/1.1
    //     Content-Type: application/json
    //     Content-Length: <length>
    //     {
    //         "problem_name": "name",
    //         "problem_data": {
    //             "vehicle_capacity": <INT>,
    //             "depots": [[<x>, <y>], ...],
    //             "customer_locations": [[<x>, <y>], ...],
    //             "customer_demands": [...]
    //         }
    //     }

    var numCustomers = input.customer_demands.length
    var customers = []
    for (var i = 0; i < numCustomers; i++) {
      customers[i] = i
    }

    var opts = {
      customer_demands: input.customer_demands,
      distances: utils.getDistances(input.customer_locations),
      depot: utils.getDepotDistances(input.depots, input.customer_locations)[0],
      maxRouteLength: 0,
      lengthPenalty: 0,
      stability: 1000,
      numWorkers: utils.getMinWorkers(input.vehicle_capacity, input.customer_demands),
      capacity: input.vehicle_capacity,
      customers: customers,
      verbose: true
    }

    var router = new Router(opts)
    var result = router.solveMdc()

    res.json(result)
    res.end()
  })

  app.post('/solve', function (req, res) {
    var opts = req.body

    // console.log('opts', opts)

    var router = new Router(opts)
    var result = router.solve()

    res.json(result)
    res.end()
  })
}

Stork.prototype.start = function () {
  // See http://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
  if (process.platform === 'win32') {
    var rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.on('SIGINT', function () {
      process.emit('SIGINT')
    })
  }

  // this function is called when you want the server to die gracefully
  // i.e. wait for existing connections
  function gracefulShutdown () {
    console.log('Server stopped')
    return process.exit(0)
  }

  // listen for INT signal e.g. Ctrl-C
  process.on('SIGINT', () => {
    console.log('Received kill signal (SIGTERM), shutting down')
    gracefulShutdown()
  })

  var port = this.opts.port
  this.app.listen(port)

  console.log('app listening on port %s', port)
  console.log('Press Ctrl+C to exit')
}
