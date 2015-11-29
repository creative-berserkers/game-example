/**
 * Created by odrin on 18.10.2015.
 */
'use strict'

module.exports = function createSetTileObstacle(emitter){
    return (ctx, spec) => {
        const model = ctx.model
        const priv = model.priv
        const pos = {
            x : Number(spec.position.x),
            y : Number(spec.position.y)
        }
        const obstacle = spec.obstacle

        const tile = model.board.data[model.board.width*pos.y + pos.x]
        const hiddenTile = model[priv].board.data[model[priv].board.width*pos.y + pos.x]

        tile.obstacle = obstacle
        hiddenTile.obstacle = obstacle

        return `tile ${pos.x},${pos.y} obstacle set to ${obstacle}}`
    }
}