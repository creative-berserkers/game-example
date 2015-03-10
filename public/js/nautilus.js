var Nautilus = Nautilus || {}

Nautilus.createClient = function(conf) {
    if(conf.onIndex === undefined) {
        throw new Error('onIndex must be callback')
    }
    var socket = conf.socket || new WebSocket(conf.host)
    var response = Object.create(null,{})
    var objects = Object.create(null,{})
    var id = 0
    var index = undefined
    
    function send(msg){
        console.log('=>')
        console.log(msg)
        socket.send(JSON.stringify(msg))
    }

    function createProxyMethod(object, objectName, method) {
        var curr = object
        method.forEach(function(node) {
            if (curr[node] === undefined) {
                curr[node] = function() {
                    var currId = id++

                    var promise = new Promise(function(resolve, reject) {
                        response[currId] = {
                            resolve: resolve,
                            reject: reject
                        }
                    })
                    var msg = {
                        type : 'object-call',    
                        path : method,
                        name : objectName,
                        id : currId,
                        args : Array.prototype.slice.call(arguments, 0)
                    }
                    send(msg)
                    return promise
                }
            }
            else {
                curr = curr[node]
            }
        })

    }
    
    function applyChange(object, change){
        if(change.type === 'update'){
            var curr = object
            change.path.forEach(function(node){
                if(change.path[change.path.length-1] === node){
                    curr[node] = change.value
                }
                curr = curr[node]
            })
        } else if(change.type === 'splice'){
            var curr = object
            change.path.forEach(function(node){
                if(change.path[change.path.length-1] === node){
                    curr[node].splice.apply(curr[node],[change.index,change.removedCount].concat(change.added))
                }
                curr = curr[node]
            })
        }
    }
    
    function applyChanges(object, changes){
        changes.forEach(function(change){
            applyChange(object, change)
        })
    }

    var client = {
        index: function() {
            return index
        }
    }

    socket.onopen = function(event) {
        if (conf.onopen) conf.onopen(client);
    }

    socket.onmessage = function(event) {
        function apply() {
            var msg = JSON.parse(event.data)
            console.log('<=')
            console.log(msg)
            if (msg.type === 'call-response') {
                if(msg.synced === true && objects[msg.resultName] === undefined){
                    msg.methods.forEach(function(method) {
                        createProxyMethod(msg.result, msg.resultName, method)
                    })
                    if(msg.resultName === 'index'){
                        conf.onIndex(msg.result)
                    }
                    objects[msg.resultName] = msg.result
                }
                
                if(response[msg.id] !== undefined){
                    response[msg.id].resolve(msg.result)
                    delete response[msg.id]
                }
            }
            if (msg.type === 'object-broadcast') {
                console.log('applying changes')
                var object = objects[msg.name]
                if(object){
                    applyChanges(object, msg.changes)
                } else {
                    console.log('object not found '+msg.name)
                }
            }
        }
        if (conf.onmessage) {
            conf.onmessage(apply)
        } else {
            apply()
        }
        
    }
    return client
}