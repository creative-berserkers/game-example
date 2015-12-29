/**
 * Created by odrin on 18.10.2015.
 */
'use strict'

module.exports = function createSetTargetTo(players, findPath, ctx, [x, y]){
        let controlledPlayer = players.find(player=>player.controlled === ctx.id)
        if(!controlledPlayer){
            ctx.callback('You are not controlling any character!')
            return
        }

        if(controlledPlayer.target.position.x === x && controlledPlayer.target.position.y === y){
            controlledPlayer.position = {
                x : x,
                y : y
            }
            controlledPlayer.target.path = []
        } else {
            controlledPlayer.target.position = {
                x : x,
                y : y
            }
            controlledPlayer.target.path = findPath(controlledPlayer.position,controlledPlayer.target.position)
        }
    }
}
