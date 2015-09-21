'use strict'
/*global PIXI */

module.exports = function createBoard(spec){
    const clientCtx = spec.clientCtx
    const graphicsCtx = spec.graphicsCtx
    const emiter = spec.emiter

    const model = clientCtx.model

    const resources = graphicsCtx.resources
    const stage = graphicsCtx.stage;

    const debug = true
    const board = new PIXI.Container()

    board.position.x = 48
    board.position.y = 48
    board.hitArea = new PIXI.Rectangle(0, 0, model.board.width*resources.floor.frameWidth, model.board.height*resources.floor.frameWidth);
    board.interactive = true
    board.buttonMode = true
    board.on('mousedown', (mouseData)=>{
        const pos = mouseData.data.getLocalPosition(board)
        const x = Math.floor(pos.x  / resources.floor.frameWidth)
        const y = Math.floor(pos.y / resources.floor.frameWidth)
        const tile = model.board.data[y*model.board.width+x]
        emiter.emit('r4two:board:tileselect',{
            position : {
                x : x,
                y : y,
            },
            obstacle : tile.obstacle
        })
    })

    const createTileLayer = (data, name, tile, i) => {
        if(data === ''){
            data = 'wall_5'
        }
        const sp = data.split('_')
        const ceiling = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])

        clientCtx.createChangeListener({
            path:['board','data',i.toString(),'layers',name],
            onChange : (path, oldValue, newValue, next)=>{
                const sp = newValue.split('_')
                ceiling.texture = resources[sp[0]].frames[sp[1]]
                next()
            }
        })

        tile.addChild(ceiling)
    }

    model.board.data.forEach((el, i)=> {

        const tile = new PIXI.Container()
        tile.position.x = (i % model.board.width) * resources.floor.frameWidth
        tile.position.y = Math.floor(i / model.board.width) * resources.floor.frameHeight

        createTileLayer(el.layers.floor, 'floor', tile, i)
        createTileLayer(el.layers.middle, 'middle', tile, i)
        createTileLayer(el.layers.ceiling, 'ceiling', tile, i)

        if(debug === true){
            const texObst = resources.debug.frames[0]
            const texNonObst = resources.wall.frames[5]

            const debug = new PIXI.Sprite(el.obstacle ? texObst : texNonObst)
            clientCtx.createChangeListener({
                path:['board','data',i.toString(),'obstacle'],
                onChange : (path, oldValue, newValue, next)=>{
                    debug.texture = newValue ? texObst : texNonObst
                    next()
                }
            })
            tile.addChild(debug)
        }

        board.addChild(tile)
    })

    stage.addChild(board)

    return {

    }
}
