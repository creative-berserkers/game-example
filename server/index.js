#!/usr/bin/env node

'use strict'
let modelSpec = require('./js/gameModel')
let Server = require('cb-http-ws-server')
let hyperion = require('cb-hyperion').hyperion

let server = Server({
  dirname : '/client'
})
server.on('clientError', (e)=>{
  console.log(e)
})

hyperion({
  wss : server,
  modelSpec : modelSpec
})
