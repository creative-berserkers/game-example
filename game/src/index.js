'use strict'
let index = require('./game_object')
let Server = require('cb-http-ws-server').Server
let hyperion = require('cb-hyperion').hyperion

hyperion({
  wss : Server(),
  index : index
})
