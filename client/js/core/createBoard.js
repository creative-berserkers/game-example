'use strict'
/*global PIXI */

module.exports = function createBoard(spec){
    const clientCtx = spec.clientCtx
    const graphicsCtx = spec.graphicsCtx
    const emiter = spec.emiter
    const parent = spec.parent

    const model = clientCtx.model

    const resources = graphicsCtx.resources

    const debug = false
    const board = new PIXI.Container()

    board.position.x = 48
    board.position.y = 48
    board.hitArea = new PIXI.Rectangle(0, 0, model.board.width*resources.floor.frameWidth, model.board.height*resources.floor.frameWidth);
    board.interactive = true
    board.buttonMode = true

    let disableInput = false
    board.on('mousedown', (mouseData)=>{
        const pos = mouseData.data.getLocalPosition(board)
        const x = Math.floor(pos.x  / resources.floor.frameWidth)
        const y = Math.floor(pos.y / resources.floor.frameWidth)
        const tile = model.board.data[y*model.board.width+x]
        if(tile.visibility === 'visible'){
            emiter.emit('r4two:board:tileselect',{
                position : {
                    x : x,
                    y : y,
                },
                obstacle : tile.obstacle
            })
            if(disableInput === true){
                return
            }
            model.setTargetTo(x, y)
        }
    })

    emiter.on('r4two:editor:visible', (flag)=>{
        disableInput = flag
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
                if(newValue === ''){
                    newValue = 'wall_5'
                }
                const sp = newValue.split('_')
                ceiling.texture = resources[sp[0]].frames[sp[1]]
                next()
            }
        })

        tile.addChild(ceiling)
    }

    const createTileFogOfWar = (tile, i)=>{
        const fogofwar = new PIXI.Sprite(resources.fogofwar.frames[0])
        fogofwar.alpha = 0.5
        if(tile.visibility === 'discovered'){
            fogofwar.visible = true
        } else {
            fogofwar.visible = false
        }
        clientCtx.createChangeListener({
            path:['board','data',i.toString(),'visibility'],
            onChange : (path, oldValue, newValue, next)=>{
                if(newValue === 'discovered'){
                    fogofwar.visible = true
                } else {
                    fogofwar.visible = false
                }
                next()
            }
        })
        tile.addChild(fogofwar)
    }

    model.board.data.forEach((el, i)=> {

        const tile = new PIXI.Container()
        tile.position.x = (i % model.board.width) * resources.floor.frameWidth
        tile.position.y = Math.floor(i / model.board.width) * resources.floor.frameHeight

        createTileLayer(el.layers.floor, 'floor', tile, i)
        createTileLayer(el.layers.middle, 'middle', tile, i)
        createTileLayer(el.layers.ceiling, 'ceiling', tile, i)

        createTileFogOfWar(tile, i)

        if(debug === true){
            const texObst = resources.debug.frames[0]
            const texNonObst = resources.wall.frames[5]

            const debug = new PIXI.Sprite(texNonObst)
            clientCtx.createChangeListener({
                path:['board','data',i.toString(),'obstacle'],
                onChange : (path, oldValue, newValue, next)=>{
                    debug.texture = newValue ? texObst : texNonObst
                    next()
                }
            })
            emiter.on('r4two:editor:show-obstacles', (flag)=>{
                if(flag === true){
                    debug.texture = el.obstacle ? texObst : texNonObst
                } else {
                    debug.texture = texNonObst
                }
            })
            tile.addChild(debug)
        }

        board.addChild(tile)
    })

    parent.addChild(board)

    return {
        container : ()=>{
            return board
        }
    }
}
