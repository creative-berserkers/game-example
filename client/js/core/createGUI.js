'use strict'
/*global PIXI */

const createButton = require('./createButton')

module.exports = function createBoard(spec){
    const clientCtx = spec.clientCtx
    const graphicsCtx = spec.graphicsCtx
    const emiter = spec.emiter
    const parent = spec.parent
    const methods = spec.methods
    const resources = graphicsCtx.resources

    let walkBtn = createButton({
        parent : parent,
        stateImages : {
            up : resources.walk_btn.frames[0],
            selected : resources.walk_btn.frames[1],
            locked : resources.walk_btn.frames[2]
        },
        position : {
            x : 10,
            y : 330
        },
        size : {
            width: 64,
            height: 16
        },
        onClick : ()=>{
            console.log('button clicked')
        }
    })

    let attackBtn = createButton({
        parent : parent,
        stateImages : {
            up : resources.attack_btn.frames[0],
            selected : resources.attack_btn.frames[1],
            locked : resources.attack_btn.frames[2]
        },
        position : {
            x : 80,
            y : 330
        },
        size : {
            width: 64,
            height: 16
        },
        onClick : ()=>{
            console.log('button clicked')
        }
    })

    let endTurnBtn = createButton({
        parent : parent,
        stateImages : {
            up : resources.end_turn_btn.frames[0],
            selected : resources.end_turn_btn.frames[1],
            locked : resources.end_turn_btn.frames[2]
        },
        position : {
            x : 550,
            y : 330
        },
        size : {
            width: 64,
            height: 16
        },
        onClick : ()=>{
            console.log('button clicked')
        }
    })
}
