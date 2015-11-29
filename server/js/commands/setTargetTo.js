/**
 * Created by odrin on 18.10.2015.
 */
'use strict'

module.exports = function createSetTargetTo(emitter){


    return (ctx, x, y) => {
        let model = ctx.model
        let controlledPlayer = ctx.get('controlledPlayer')

        if(controlledPlayer.target.position.x === x && controlledPlayer.target.position.y === y){
            controlledPlayer.position = {
                x : x,
                y : y
            }
            controlledPlayer.target.path = []
            emitter.emit('invalid-light')
        } else {
            controlledPlayer.target.position = {
                x : x,
                y : y
            }
            controlledPlayer.target.path = controlledPlayer[model.priv].findPath(controlledPlayer.position,controlledPlayer.target.position)
        }
    }
}