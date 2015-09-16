'use strict'
/*global PIXI */

module.exports = function createBoard(spec){
    const model = spec.model
    const debug = spec.debug
    const resources = spec.resources
    const stage = spec.stage;

    const board = new PIXI.Container()

    board.position.x = 48
    board.position.y = 48

    model.board.data.forEach((el, i)=> {

        const tile = new PIXI.Container()
        tile.position.x = (i % model.board.width) * resources.floor.frameWidth
        tile.position.y = Math.floor(i / model.board.width) * resources.floor.frameHeight

        if(el.layers.floor !== ''){
            const sp = el.layers.floor.split('_')
            const floor = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
            tile.addChild(floor)
        }

        if(el.layers.middle !== ''){
            const sp = el.layers.middle.split('_')
            const middle = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
            tile.addChild(middle)
        }

        if(el.layers.ceiling !== ''){
            const sp = el.layers.middle.split('_')
            const ceiling = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
            tile.addChild(ceiling)
        }

        if(debug === true && el.obstacle === true){
            const debug = new PIXI.Sprite(resources.debug.frames[0])
            tile.addChild(debug)
        }

        board.addChild(tile)
    })

    stage.addChild(board)

    return {

    }
}
