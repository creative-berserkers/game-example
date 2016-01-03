const createCommandMapping = require('./createCommandMapping')
const createEventMapping = require('./createEventMapping')
const Multiobserve = require('cb-multiobserve').Multiobserve
const express = require('express')
const path = require('path')
const fs = require('fs')
const https = require('https')
const app = express()
const model = require('./gameModel')
const R = require('ramda')
const commandlog = path.join(__dirname, '../logs/commandlog.txt')

app.use(express.static(path.join(__dirname, '../../client')))

let server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../conf/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '../conf/localhost.crt'))
}, app)

const io = require('socket.io')(server)

server.listen(8443)

//const ioEmitModelUpdate = R.curry(io.emit)('model-update')

const methods = createCommandMapping(model)
const events = createEventMapping(model, (c)=>{
    io.emit('model-update', c)
})

Multiobserve.observe(model, function(changes){
    io.emit('model-update', changes)
    changes.forEach(change=>{
        const event = R.path(change.path,events)
        if(event){
            event(model, (c)=>{
                io.emit('model-update', c)
            },change)
        }
    })
})

fs.appendFileSync(commandlog, 'x '+(new Date())+'\n')

io.on('connection', function (socket) {
  console.log('connection received ', socket.id)
    socket.emit('model', model);

    socket.__emit = socket.emit

    socket.emit = function (channel, data) {
      //process data;
      fs.appendFileSync(commandlog, '< '+socket.id+' '+JSON.stringify(data)+'\n')
      socket.__emit(channel, data)
    }

    socket.on('call', function (data, callback) {
        const {name, args} = data
        console.log('call to '+name+' by ', socket.id)
        fs.appendFileSync(commandlog, '> '+socket.id+' '+JSON.stringify(data)+'\n')
        if(typeof(methods[name]) === 'function' ){
            methods[name]({
                id : socket.id,
                callback : callback
            }, args)
        } else {
            console.warn('wrong call', data)
        }
    })
    socket.on('disconnect',()=>{
        methods.disconnect({
            id : socket.id
        })
        console.log(socket.id, ' disconnected')
    })
})
console.log('init done')
