#!/usr/bin/env node

'use strict'
let modelSpec = require('./js/gameModel')
//let createHyperionServer = require('cb-hyperion').createHyperionServer
const Multiobserve = require('cb-multiobserve').Multiobserve
let express = require('express')
let path = require('path')
let fs = require('fs')
let https = require('https')
//let WebSocketServer = require("ws").Server
const io = require('socket.io')(https)
let app = express()

app.use(express.static(path.join(__dirname, '../client')))
let server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'conf/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, 'conf/localhost.crt'))
}, app)

server.listen(443)

/*let wss = new WebSocketServer({
    server: server,
    path: "/"
})*/

const dispatch = function(methods, name, context, args){
    methods[name].apply(undefined, args.unshift(context))
}

const dispatchMethods = R.curry(modelSpec.model)

const createHyperionServer = function(modelSpec){
    let players = new Map()
    Multiobserve.observe(modelSpec.model, function(changes){
        for (var callback of myMap.values()) {
            callback(changes)
        }
    })
    return {
        registerPlayer : (playerName, callback) =>{
            callback({
                type: 'call-response',
                name: 'index',
                id: -1,
                synced: true,
                methods: [],
                result: modelSpec.model,
                resultName: 'index'
            })
            players.set(playerName, callback)
        },
        unregisterPlayer : (playerName) => {
            players.delete(playerName)
        }
    }
}


const gameServer = createHyperionServer(modelSpec)

let guid = 0
io.on('connection', function(socket) {
    let playerName = 'Player ' + (guid++)
    gameServer.registerPlayer(playerName,(msg) => {
        socket.emit('object-broadcast',JSON.stringify(msg))
    })
    socket.on('close', function close() {
        gameServer.unregisterPlayer(playerName)
    })
    socket.on('call', (msg, callback) => {
        dispatchMethods(name, {
            name : playerName,
            callback : callback
        }, args)
    })
})
