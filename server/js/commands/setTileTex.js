/**
 * Created by odrin on 18.10.2015.
 */
'use strict'

module.exports = function createSetTileTex(emitter){
    return (ctx, spec)=>{
        const model = ctx.model
        const priv = model.priv
        const pos = {
            x : Number(spec.position.x),
            y : Number(spec.position.y)
        }
        const layer = spec.layer
        const tex = spec.newTex

        const tile = model.board.data[model.board.width*pos.y + pos.x]
        const hiddenTile = model[priv].board.data[model.board.width*pos.y + pos.x]

        tile.layers[layer] = tex
        hiddenTile.layers[layer] = tex
        return `tile ${pos.x},${pos.y} on layer ${layer} set to ${tex}`
    }
}