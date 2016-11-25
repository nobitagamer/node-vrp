var Stork = require('./stork')

new Stork({ port: process.env.PORT || 8080, verbose: true }).start()
