'use strict'

module.exports = function handshake(model, ctx, args){
    model.players.find(player=>{
        if(player.controlled === ''){
            player.controlled = ctx.id
            return true
        }
    })
}
