'use strict'

module.exports = function disconnect(model, ctx){
    model.players.find(player=>{
        if(player.controlled === ctx.id){
            player.controlled = ''
            return true
        }
    })
}
