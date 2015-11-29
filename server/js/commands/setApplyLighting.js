/**
 * Created by odrin on 19.10.2015.
 */
'use strict'

module.exports = function createSetApplyLighting(emitter){
    return (ctx, flag)=>{
        const model = ctx.model
        const priv = model.priv

        model[priv].applyLighting = flag
        emitter.emit('invalid-light')
    }
}