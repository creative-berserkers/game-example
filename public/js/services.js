angular.module('GameServices', ['ngCookies','ngWebSocket'])
.service('nautilus', ['$rootScope', '$cookieStore', '$timeout', '$websocket', function($rootScope, $cookieStore, $timeout, $websocket) {
    var index = {}
    var session = undefined
    var sessionCallbacks = []
    
    var uniqueId = '12345'
    /*$cookieStore.get('uniqueId')
    if(uniqueId === undefined){
        $cookieStore.put('uniqueId', guid() )
        uniqueId = $cookieStore.get('uniqueId')
    }*/
    
    var angSocket = $websocket('wss://' + location.host)
    
    var socket = {
        send : function(msg){
            angSocket.send(msg)
        }
    }
    
    angSocket.onMessage(function(msg){
        socket.onmessage && socket.onmessage(msg)
    })
    angSocket.onClose(function(msg){
        socket.onclose && socket.onclose(msg)
    })
    
    Nautilus.createClient({
        socket: socket,
        onmessage: function(apply) {
            apply()
            $timeout(function(){
                $rootScope.$apply()
            },0)
        },
        onIndex : function(idx){
            console.log('received index object')
            angular.copy(idx, index)
            index.registerSession(uniqueId).then(function(ses){
                session = ses
                if(sessionCallbacks.length !== 0){
                    sessionCallbacks.forEach(function(cb){
                        cb(session)
                    })
                }
                console.log('received session object')
            })
        }
    })
    return {
        session: function(cb){
            if(session === undefined){
                sessionCallbacks.push(cb)
            } else {
                cb(session)
            }
        }
    }
}])
.service('settings', [ '$cookieStore', function($cookieStore) {
    return {
        isRememberMeEnabled : function(){
            var rememberMeEnabled = $cookieStore.get('remember-me-enabled')
            if(rememberMeEnabled === undefined){
                $cookieStore.get('remember-me-enabled', false)
                return false
            }
            return rememberMeEnabled
        },
        setRememberMeEnabled : function(flag){
            $cookieStore.put('remember-me-enabled', flag)
        },
        username : function(){
            return $cookieStore.get('username')
        },
        setUsername : function(username){
            $cookieStore.put('username', username)
        }
    }
}])
.service('game', [ function() {
    var game = undefined
    return {
        init : function(g){
            game = g
        }
    }
}])