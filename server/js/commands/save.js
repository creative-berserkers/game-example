/**
 * Created by odrin on 19.10.2015.
 */
'use strict'
const fs = require('fs')
module.exports = function(emitter){
    return (ctx)=>{
        const model = ctx.model
        const priv = model.priv

        fs.writeFileSync('./server/assets/levels/level1.json', JSON.stringify(model[priv].board, null, 2),'utf8')
        return `The file was saved!`
    }
}