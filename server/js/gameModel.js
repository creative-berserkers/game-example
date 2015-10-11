'use strict'

const fs = require('fs');
const createPathFinder = require('./pathfinding/createPathFinder')
const createLightCaster = require('./lightcasting/createLightCaster')

const defaultBoardWidth = 25
const defaultBoardHeight = 12

let model
let hiddenModel

hiddenModel = {
    board : JSON.parse(fs.readFileSync('./server/assets/levels/level1.json', 'utf8')),
    players : [],
    applyLighting : true
}


const distance = (x1,y1, x2,y2)=>{

    let dx = x2-x1
    let dy = y2-y1

    return Math.sqrt(dx*dx + dy*dy)
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

            let playerA = players[0]===undefined? undefined :players[0].get('controlledPlayer')
            let playerB = players[1]===undefined? undefined :players[1].get('controlledPlayer')

            let isVisiblePlayerA = players[0]===undefined?false:players[0].get('lightcaster').isVisible(x,y)
            let isVisiblePlayerB = players[1]===undefined?false:players[1].get('lightcaster').isVisible(x,y)

            let isInDistPlayerA = false
            if(isVisiblePlayerA === true && playerA !== undefined && distance(playerA.position.x, playerA.position.y, x,y) < 5){
                isInDistPlayerA = true
            }

            let isInDistPlayerB = false
            if(isVisiblePlayerB === true && playerB !== undefined && distance(playerB.position.x, playerB.position.y, x,y) < 5){
                isInDistPlayerB = true
            }

            line += (isInDistPlayerA || isInDistPlayerB || !applyLighting)===true?'.':'X'

            if(dstTile.visibility === 'visible'){
                dstTile.visibility = 'discovered'
            }
            if(isInDistPlayerA || isInDistPlayerB || !applyLighting){
                dstTile.layers.floor = srcTile.layers.floor
                dstTile.layers.middle = srcTile.layers.middle
                dstTile.layers.ceiling = srcTile.layers.ceiling
                dstTile.obstacle = srcTile.obstacle
                dstTile.visibility = 'visible'
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
        if(controlledPlayer.target.position.x === x && controlledPlayer.target.position.y === y){
            controlledPlayer.position = {
                x : x,
                y : y
            }
            controlledPlayer.target.path = []
            ctx.get('lightcaster').calculateFrom(controlledPlayer.position.x, controlledPlayer.position.y)
            copyBoardData(hiddenModel.board, model.board, hiddenModel.applyLighting, hiddenModel.players)
        } else {
            controlledPlayer.target.position = {
                x : x,
                y : y
            }
            controlledPlayer.target.path = ctx.get('pathfinder').findPath(controlledPlayer.position,controlledPlayer.target.position)
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

module.exports = {
    onJoin: (ctx) =>{
        console.log('client joined '+ctx.name)
        if(model.players.aPlayer.controlled === ''){
            model.players.aPlayer.controlled = ctx.name
            ctx.set('controlledPlayer', model.players.aPlayer)
            console.log('...as APlayer')
        } else if(model.players.bPlayer.controlled === '') {
            model.players.bPlayer.controlled = ctx.name
            ctx.set('controlledPlayer', model.players.bPlayer)
            console.log('...as BPlayer')
        } else {
            console.log('...as Guest')
        }
        if(ctx.get('controlledPlayer') === undefined){
            console.log('skipping set up of light casting')
            return
        }
        ctx.set('pathfinder', createPathFinder({
            width : model.board.width,
            height : model.board.height,
            isObstacle : (x,y)=>{
                if(ctx.get('controlledPlayer') !== model.players.aPlayer &&
                    x === model.players.aPlayer.position.x && y === model.players.aPlayer.position.y){
                    return true
                }
                if(ctx.get('controlledPlayer') !== model.players.bPlayer &&
                    x === model.players.bPlayer.position.x && y === model.players.bPlayer.position.y){
                    return true
                }
                return model.board.data[y*model.board.width + x].obstacle
            }
        }))
        ctx.set('lightcaster', createLightCaster({
            width : hiddenModel.board.width,
            height : hiddenModel.board.height,
            isObstacle : (x,y)=>{
                return model.board.data[y*model.board.width + x].obstacle
            }
        }))
        hiddenModel.players.push(ctx)
        let controlledPlayer = ctx.get('controlledPlayer')
        ctx.get('lightcaster').calculateFrom(controlledPlayer.position.x, controlledPlayer.position.y)
        copyBoardData(hiddenModel.board, model.board, hiddenModel.applyLighting, hiddenModel.players)
    },
    onLeave: (ctx) =>{
        if(ctx.has('controlledPlayer')){
            ctx.get('controlledPlayer').controlled = ''
        }
        const index = hiddenModel.players.indexOf(ctx)
        if (index > -1) {
            hiddenModel.players.splice(index, 1);
        }
        console.log('client leaved '+ctx.name)
    },
    model : model
}
