angular.module('GameServices', ['ngCookies','ngWebSocket'])
.service('nautilus', ['$rootScope', '$timeout', '$websocket', function($rootScope, $timeout, $websocket) {
    var index = undefined
    var indexCallbacks = []
    
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
            index = idx
            indexCallbacks.forEach(function(el){
                el(index)
            })
            indexCallbacks = []
        }
    })
    return {
        index: function(cb){
            if(index === undefined){
                indexCallbacks.push(cb)
            } else {
                cb(index)
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
            $cookieStore.put('remember-me-enabled', flag === undefined? false : flag)
        },
        username : function(){
            return $cookieStore.get('username')
        },
        setUsername : function(username){
            $cookieStore.put('username', username)
        },
        uniqueId : function(){
            return $cookieStore.get('uniqueId')
        },
        setUniqueId : function(uniqueId){
            $cookieStore.put('uniqueId', uniqueId)
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