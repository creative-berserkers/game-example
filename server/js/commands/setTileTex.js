/**
 * Created by odrin on 18.10.2015.
 */
'use strict'

module.exports = function setTileTex(board, ctx, [{position,layer,tex}]){
    const pos = {
        x : Number(position.x),
        y : Number(position.y)
    }

    const tile = board.data[board.width*pos.y + pos.x]

    tile.layers[layer] = tex
    ctx.callback(undefined,`tile ${pos.x},${pos.y} on layer ${layer} set to ${tex}`)
}
