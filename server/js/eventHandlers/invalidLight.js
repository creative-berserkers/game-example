/**
 * Created by odrin on 18.10.2015.
 */
'use strict'

module.exports = function invalidLight(model, emitter){
    const priv = model.priv
    const src = model[priv].board
    const dst = model.board
    const applyLighting = model[priv].applyLighting
    const players = model.players

    const distance = (x1,y1, x2,y2)=>{

        let dx = x2-x1
        let dy = y2-y1

        return Math.sqrt(dx*dx + dy*dy)
    }

    emitter.on('invalid-light', ()=>{
        console.log('invalid light')
        players[0][priv].lightcaster.calculateFrom(players[0].position.x, players[0].position.y)
        players[1][priv].lightcaster.calculateFrom(players[1].position.x, players[1].position.y)

        model.monsters.forEach((el)=>{
            let position = el[priv].position
            if(position.x === -1 || position.y === -1){
                return
            }
            let typeIndex = el[priv].typeIndex
            if(distance(players[0].position.x, players[0].position.y, position.x, position.y) < 3 ||
                distance(players[1].position.x, players[1].position.y, position.x, position.y) < 3){
                el.visible = true
                el.position = {
                    x : position.x,
                    y : position.y
                }
                el.typeIndex = typeIndex
            } else {
                el.visible = false
            }
        })

        for(let y=0; y < dst.height ; ++y){
            let line = ''
            for(let x = 0; x < dst.width; ++x){
                let dstTile = dst.data[y*dst.width + x]
                let srcTile = src.data[y*dst.width + x]

                let isInDistPlayerA = false
                if(players[0][priv].lightcaster.isVisible(x,y) && distance(players[0].position.x, players[0].position.y, x,y) < 3){
                    isInDistPlayerA = true
                }

                let isInDistPlayerB = false
                if(players[1][priv].lightcaster.isVisible(x,y) && distance(players[0].position.x, players[0].position.y,x,y) < 3){
                    isInDistPlayerB = true
                }

                //line += (isInDistPlayerA || isInDistPlayerB || !applyLighting)===true?'.':'X'

                /*if(dstTile.visibility === 'visible'){
                 dstTile.visibility = 'discovered'
                 }*/
                if(isInDistPlayerA || isInDistPlayerB || !applyLighting){
                    dstTile.layers.floor = srcTile.layers.floor
                    dstTile.layers.middle = srcTile.layers.middle
                    dstTile.layers.ceiling = srcTile.layers.ceiling
                    dstTile.obstacle = srcTile.obstacle
                    dstTile.visibility = 'visible'
                    line += ' '
                } else {
                    if(dstTile.visibility === 'visible'){
                        dstTile.visibility = 'discovered'
                    }

                    if(dstTile.visibility === 'discovered'){
                        line += '.'
                    } else {
                        line += 'X'
                    }
                }
            }
            console.log(line)
        }
        console.log('')
    })
}