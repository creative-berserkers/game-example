'use strict'

const fs = require('fs');
const createPathFinder = require('./pathfinding/createPathFinder')
const createLightCaster = require('./lightcasting/createLightCaster')

const defaultBoardWidth = 25
const defaultBoardHeight = 12

let model
let hiddenModel

const distance = (x1,y1, x2,y2)=>{

    let dx = x2-x1
    let dy = y2-y1

    return Math.sqrt(dx*dx + dy*dy)
}

hiddenModel = {
    board : JSON.parse(fs.readFileSync('./server/assets/levels/level1.json', 'utf8')),
    players : {
        aPlayer : {
            pathfinder : createPathFinder({
                width : defaultBoardWidth,
                height : defaultBoardHeight,
                isObstacle : (x,y)=>{
                    /*if(x === model.players.aPlayer.position.x && y === model.players.aPlayer.position.y){
                        return true
                    }
                    if(x === model.players.bPlayer.position.x && y === model.players.bPlayer.position.y){
                        return true
                    }*/
                    return model.board.data[y*model.board.width + x].obstacle
                }
            }),
            lightcaster : createLightCaster({
                width : defaultBoardWidth,
                height : defaultBoardHeight,
                isObstacle : (x,y)=>{
                    return model.board.data[y*model.board.width + x].obstacle
                }
            }),
            distance : (x,y)=>{
                return distance(model.players.aPlayer.position.x, model.players.aPlayer.position.y, x,y)
            }
        },
        bPlayer : {
            pathfinder : createPathFinder({
                width : defaultBoardWidth,
                height : defaultBoardHeight,
                isObstacle : (x,y)=>{
                    /*if(x === model.players.aPlayer.position.x && y === model.players.aPlayer.position.y){
                        return true
                    }
                    if(x === model.players.bPlayer.position.x && y === model.players.bPlayer.position.y){
                        return true
                    }*/
                    return model.board.data[y*model.board.width + x].obstacle
                }
            }),
            lightcaster : createLightCaster({
                width : defaultBoardWidth,
                height : defaultBoardHeight,
                isObstacle : (x,y)=>{
                    return model.board.data[y*model.board.width + x].obstacle
                }
            }),
            distance : (x,y)=>{
                return distance(model.players.bPlayer.position.x, model.players.bPlayer.position.y, x,y)
            }
        }
    },
    applyLighting : true
}

const createEmptyBoard = (boardData) => {
    let data = []
    for(let i=0; i<boardData.width * boardData.height; ++i){
        data.push({
            id: i,
            layers: {
                floor: 'fogofwar_0',
                middle: 'fogofwar_0',
                ceiling: 'fogofwar_0'
            },
            obstacle: false,
            visibility: 'none'
        })
    }

    return {
        width : boardData.width,
        height : boardData.height,
        data : data
    }
}

const copyBoardData = (src, dst, applyLighting, players)=>{
    for(let y=0; y < dst.height ; ++y){
        let line = ''
        for(let x = 0; x < dst.width; ++x){
            let dstTile = dst.data[y*dst.width + x]
            let srcTile = src.data[y*dst.width + x]

            let isInDistPlayerA = false
            if(players.aPlayer.lightcaster.isVisible(x,y) && players.aPlayer.distance(x,y) < 3){
                isInDistPlayerA = true
            }

            let isInDistPlayerB = false
            if(players.bPlayer.lightcaster.isVisible(x,y) && players.bPlayer.distance(x,y) < 3){
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
}

model = {
    board: createEmptyBoard(hiddenModel.board),
    players: {
        aPlayer :{
            controlled: '',
            position: {
                x: 3,
                y: 3
            },
            className : 'mage',
            target : {
                path: [],
                position :{
                    x : 0,
                    y : 0
                }
            },
            hp : {
                max: 10,
                current: 5
            }
        },
        bPlayer : {
            controlled: '',
            position: {
                x: 5,
                y: 3
            },
            className: 'mage',
            target : {
                path: [],
                position :{
                    x : 0,
                    y : 0
                }
            },
            hp : {
                max: 10,
                current: 8
            }
        }
    },
    setTargetTo(ctx, x, y){
        if (!ctx.has('controlledPlayer')) {
            return;
        }
        let controlledPlayer = ctx.get('controlledPlayer')
        let controlledPlayerHidden = ctx.get('controlledPlayerHidden')

        if(controlledPlayer.target.position.x === x && controlledPlayer.target.position.y === y){
            controlledPlayer.position = {
                x : x,
                y : y
            }
            controlledPlayer.target.path = []
            controlledPlayerHidden.lightcaster.calculateFrom(controlledPlayer.position.x, controlledPlayer.position.y)
            copyBoardData(hiddenModel.board, model.board, hiddenModel.applyLighting, hiddenModel.players)
        } else {
            controlledPlayer.target.position = {
                x : x,
                y : y
            }
            controlledPlayer.target.path = controlledPlayerHidden.pathfinder.findPath(controlledPlayer.position,controlledPlayer.target.position)
        }
    },
    endTurn(ctx) {
        console.log('turn ended');
    },
    save(ctx){
        fs.writeFileSync('./server/assets/levels/level1.json', JSON.stringify(hiddenModel.board, null, 2),'utf8')
        return `The file ${hiddenModel.boardName} was saved!`
    },
    loadBoard(){
        /*fs.readFile( "./server/assets/levels/level1.json", function (err, data) {
            if (err) {
                throw err;
            }
            model.board = JSON.parse(data.toString());
        });*/

        return 'board loaded'
    },
    createBoard(){
        return 'board created'
    },
    setApplyLighting(ctx, flag){
        hiddenModel.applyLighting = flag
        copyBoardData(hiddenModel.board, model.board, hiddenModel.applyLighting, hiddenModel.players)
    },
    setTileTex(ctx, spec){
        const pos = {
            x : Number(spec.position.x),
            y : Number(spec.position.y)
        }
        const layer = spec.layer
        const tex = spec.newTex

        const tile = model.board.data[model.board.width*pos.y + pos.x]
        const hiddenTile = hiddenModel.board.data[model.board.width*pos.y + pos.x]

        tile.layers[layer] = tex
        hiddenTile.layers[layer] = tex
        return `tile ${pos.x},${pos.y} on layer ${layer} set to ${tex}`
    },
    setTileObstacle(ctx, spec){
        const pos = {
            x : Number(spec.position.x),
            y : Number(spec.position.y)
        }
        const obstacle = spec.obstacle

        const tile = model.board.data[model.board.width*pos.y + pos.x]
        const hiddenTile = hiddenModel.board.data[hiddenModel.board.width*pos.y + pos.x]

        tile.obstacle = obstacle
        hiddenTile.obstacle = obstacle

        hiddenModel.players.forEach((ctx)=>{ctx.get('pathfinder').invalidateCache()})
        return `tile ${pos.x},${pos.y} obstacle set to ${obstacle}}`
    }
}

hiddenModel.players.aPlayer.lightcaster.calculateFrom(model.players.aPlayer.position.x, model.players.aPlayer.position.y)
hiddenModel.players.bPlayer.lightcaster.calculateFrom(model.players.bPlayer.position.x, model.players.bPlayer.position.y)
copyBoardData(hiddenModel.board, model.board, hiddenModel.applyLighting, hiddenModel.players)

module.exports = {
    onJoin: (ctx) =>{
        console.log('client joined '+ctx.name)
        if(model.players.aPlayer.controlled === ''){
            model.players.aPlayer.controlled = ctx.name
            ctx.set('controlledPlayer', model.players.aPlayer)
            ctx.set('controlledPlayerHidden', hiddenModel.players.aPlayer)
            console.log('...as APlayer')
        } else if(model.players.bPlayer.controlled === '') {
            model.players.bPlayer.controlled = ctx.name
            ctx.set('controlledPlayer', model.players.bPlayer)
            ctx.set('controlledPlayerHidden', hiddenModel.players.bPlayer)
            console.log('...as BPlayer')
        } else {
            console.log('...as Guest')
        }
    },
    onLeave: (ctx) =>{
        if(ctx.has('controlledPlayer')){
            ctx.get('controlledPlayer').controlled = ''
        }
        console.log('client leaved '+ctx.name)
    },
    model : model
}
