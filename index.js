require('cb-hyperion').hyperion({
    wss : require('cb-http-ws-server').Server(),
    index : require('./lib/game-object').index
})