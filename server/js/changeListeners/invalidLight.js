'use strict'

module.exports = function invalidLight(modelChangeHandler){

    const distance = (x1,y1, x2,y2)=>{

        let dx = x2-x1
        let dy = y2-y1

        return Math.sqrt(dx*dx + dy*dy)
    }

    modelChangeHandler.on(['players','*','position'], ({board, players}, path, oldPosition, newPosition)=>{
        console.log('invalid light')
        let playerId = path[1]
        let player = players[playerId]
        player._lightcaster.calculateFrom(newPosition.x, newPosition.y)

        for(let y=0; y < board.height; ++y){
            for(let x = 0; x < board.width; ++x){
                let tile = board.data[y*board.width + x]
                tile.visible = (player._lightcaster.isVisible(x,y) && distance(newPosition.x, newPosition.y, x,y) < 3))
            }
        }
    })
}
