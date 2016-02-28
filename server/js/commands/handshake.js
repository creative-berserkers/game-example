'use strict'

const R = require('ramda')
const Random = require('../util/Random')

module.exports = function handshake(model, ctx, args){
    let isOccupiedByPlayer = (x,y)=>{
        if(model.players.find(player=>{
            player.position.x === x && player.position.y === y
        })){
            return true
        } else {
            return false
        }
    }

    let getRandomPlayerPosition = R.curry(Random.getRandomPosition)((x,y)=>{
        return isOccupiedByPlayer(x,y) || model.board.isObstacle(x,y)
    })

    model.players.find(player=>{
        if(player.controlled === ''){
            player.controlled = ctx.id

            let randomPosition = getRandomPlayerPosition(model.board.width, model.board.height, 100)

            player.position = randomPosition

            return true
        }
    })
}
