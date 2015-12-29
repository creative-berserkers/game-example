'use strict'

module.exports = function setTileObstacle(board, ctx, [{position,obstacle}]) {
    const pos = {
        x : Number(position.x),
        y : Number(position.y)
    }

    const tile = board.data[board.width*pos.y + pos.x]

    tile.obstacle = obstacle

    ctx.callback(`tile ${pos.x},${pos.y} obstacle set to ${obstacle}}`)
}
