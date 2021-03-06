/* eslint-env jquery */
/* global google */

$(function () {
    console.log('at demo.js')

    var palette = ['87CEEB', 'FFFFE0', 'FFC0CB', '00FF7F', 'FFA07A']

    var $elapsed = $('#elapsed')
    var $cost = $('#cost')
    var $solution = $('#solution')
    var $customers = $('#customers')
    var $depot = $('#depot')
    var $numWorkers = $('#numWorkers')
    var $maxRouteLength = $('#maxRouteLength')
    var $lengthPenalty = $('#lengthPenalty')
    var $stability = $('#stability')
    // var $info = $('#info')
    // var $options = $('#options')
    var $errorMessage = $('#errorMessage')

    // stork input arrays
    var distances = []
    var depot = []

    // render map in container
    var map = new Map('#map-canvas')

    //
    //  Solves the problem and renders the map
    //
    function solve(opts) {
        var customers = opts.customers
        var depotLoc = opts.depotLoc

        var depots = [].slice.call(depotLoc)

        depots.forEach(function (el, j) {
            // render depot on map
            map.geocode(el, function (err, res) {
                if (err) return console.log('google geocode error:', err)
                map.depotPos = res[0].geometry.location
                map.makeMarker(map.depotPos, 'B57EDC')
            })
        })

        //// render depot on map
        //map.geocode(depotLoc, function (err, res) {
        //    if (err) return console.log('google geocode error:', err)
        //    map.depotPos = res[0].geometry.location
        //    map.makeMarker(map.depotPos, 'B57EDC')
        //})

        console.log('opts customers', customers)

        var locations = [].slice.call(customers)


        depotLoc.forEach(function (el, i) {
            locations.push(el)
        })

        //locations.unshift(depotLoc)

        //locations.unshift(depotLoc)

        // get distance matrix from google
        var service = new google.maps.DistanceMatrixService()

        var matrixOpts = {
            origins: locations,
            destinations: locations,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false
        }

        service.getDistanceMatrix(matrixOpts, cb)

        // make REST API call to stork app and render solution in map
        function cb(res, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) { return console.log('got google status:', status) }

            // success - format google's data for REST API call to stork
            var origins = res.originAddresses
            // var dests = res.destinationAddresses

            origins.forEach(function (origin, i) {
                distances[i] = []
                var elements = res.rows[i].elements

                console.log('geocode result ', i, origin)

                elements.forEach(function (el, j) {
                    var dist = el.distance.value
                    distances[i].push(dist)
                })
            })

            // remove depot from distance matrix
            distances.shift()
            distances.forEach(function (row) {
                var first = row.shift()
                depot.push(first)
            })

            // build customers array for stork input
            var custs = []
            var num = distances.length

            while (num--) {
                custs.push(num)
            }
            custs.reverse()

            var storkOpts = opts
            storkOpts.customers = custs
            storkOpts.distances = distances
            storkOpts.depot = depot

            $.ajax({
                type: 'POST',
                url: '/solve',
                data: JSON.stringify(opts),
                headers: {
                    'content-type': 'application/json'
                }
            })
              .success(function (data) {
                  var result = data

                  // render solution info in left column
                  $elapsed.text('Elapsed time: ' + result.elapsed + ' ms')
                  $cost.text('Cost: ' + result.cost / 1000 + ' km')
                  $solution.text('Solution:')

                  // render solution on map
                  result.solution.forEach(function (route, k) {
                      // path for polyline drawing
                      var path = [map.depotPos]
                      var pathColor = palette[k]
                      var $route = $('<div class="route">')

                      var txt = route.map(function (cust) { return customers[cust] }).join(' -> ')

                      // paint routes according to worker
                      $route.text(txt)
                      $route.css('background-color', '#' + palette[k])
                      $route.appendTo($solution)

                      // render route on map
                      route.forEach(function (cust, c) {
                          map.geocode(customers[cust], function (err, res) {
                              if (err) return console.log('google geocode error:', err)
                              // successful geocoding - show marker on map
                              var marker = map.makeMarker(res[0].geometry.location, palette[k])
                              marker.title = c.toString() + ' - ' + customers[c]
                              path.push(res[0].geometry.location)

                              if (c === route.length - 1) {
                                  path.push(map.depotPos)
                                  map.makePolyline(path, pathColor)
                              }
                          })
                      })
                  })
              })
              .error(function (err) {
                  console.log('POST error:', err)
              })
        }
    }

    //
    //  Fill demo with example
    //
    var depotLoc = ['9 Nguyễn Trãi, Bến Thành, Quận 1, Hồ Chí Minh, Vietnam']
    var customers = [
      '10|Công viên 30-4, Pasteur, Bến Nghé, Hồ Chí Minh, Bến Nghé Quận 1 Hồ Chí Minh, Vietnam',
      '11|Bến tàu khách Thành phố, Bến Nghé, District 1, Ho Chi Minh, Vietnam',
      '12|92B/20 Tôn Thất Thuyết, phường 16, Quận 4, Hồ Chí Minh, Vietnam',
      '13|459A Hai Bà Trưng, phường 8, Quận 3, Ho Chi Minh City, Vietnam',
      '14|273 An Dương Vương, phường 3, Quận 5, Hồ Chí Minh, Vietnam',
      '15|764 Võ Văn Kiệt, phường 1, Hồ Chí Minh, phường 1, Vietnam',
      '16|Đường số 9, 02-04, Khu đô thị Him Lam, Tân Hưng, Quận 7, Hồ Chí Minh, Vietnam',
      '17|180 Cao Lỗ, phường 4, Quận 8, Ho Chi Minh City, Vietnam',
      '18|TheVentures Vietnam, 3rd Floor, 9 Nguyễn Trãi, Bến Thành, Quận 1, Hồ Chí Minh, Vietnam'
    ]

    // stork solution opts
    var opts = {
        numWorkers: 3,
        customers: customers,
        depotLoc: depotLoc,
        maxRouteLength: 20000,
        lengthPenalty: 10,
        stability: 1000,
        verbose: false,
        customer_demands: []
    }

    var ncustomers = opts.customers
    opts.customers = []
    ncustomers.forEach(function (el, j) {
        opts.customers.push(el.split('|')[1])
        opts.customer_demands.push(el.split('|')[0])
    })


    // fill out default depot & customer locations
    $depot.text(depotLoc.join('\n'))
    $customers.text(customers.join('\n'))
    $numWorkers.val(opts.numWorkers)
    $maxRouteLength.val(opts.maxRouteLength)
    $lengthPenalty.val(opts.lengthPenalty)
    $stability.val(opts.stability)

    // render the solution
    solve(opts)

    // solve whenever submit button is clicked
    $('button#submit').click(function () {
        map.clear()

        opts.depotLoc = $depot.text().split('\n')
        opts.customers = $customers.text().split('\n')

        //var all_customers = $customers.text().split('\n');
        //all_customers.forEach(function (el, j) {
        //    opts.customers.push(el.split('|')[1])
        //    opts.customer_demands.push(el.split('|')[0])
        //})

        var inputValid = true

        function checkOpts(which, val) {
            if (Number.isNaN(parseInt(val))) {
                inputValid = false
                $errorMessage.text('Invalid entry for ' + which + ': ' + val + '. Must be Number.')
                return false
            }
            return true
        }

        if (checkOpts('# workers', $numWorkers.val())) { opts.numWorkers = $numWorkers.val() }
        if (checkOpts('Max Route Length', $maxRouteLength.val())) { opts.maxRouteLength = $maxRouteLength.val() }
        if (checkOpts('Length Overage Penalty', $lengthPenalty.val())) { opts.lengthPenalty = $lengthPenalty.val() }
        if (checkOpts('Stability', $stability.val())) { opts.stability = $stability.val() }

        if (inputValid) {
            $errorMessage.text('')
            solve(opts)
        }
    })
})
