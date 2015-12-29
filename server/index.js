const createCommandMapping = require('./js/createCommandMapping')
const Multiobserve = require('cb-multiobserve').Multiobserve
const express = require('express')
const path = require('path')
const fs = require('fs')
const https = require('https')
const app = express()
const model = require('./js/gameModel')

app.use(express.static(path.join(__dirname, '../client')))

let server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'conf/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, 'conf/localhost.crt'))
}, app)

const io = require('socket.io')(server)

server.listen(8443)

const methods = createCommandMapping(model)

Multiobserve.observe(model, function(changes){
    io.emit('model-update', changes)
})


io.on('connection', function (socket) {
  console.log('connection received ', socket.id)
    socket.emit('model', model);

    socket.__emit = socket.emit

    socket.emit = function (channel, data) {
      //process data;
      socket.__emit(channel, data);
    }

    socket.on('call', function ({name, args}, callback) {
        methods[name]({
            id : socket.id,
            callback : callback
        }, args)
    })
    socket.on('disconnect',()=>{
        console.log(socket.id, ' disconnected')
    })
})
console.log('init done')
