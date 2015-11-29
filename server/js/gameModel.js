'use strict'

const fs = require('fs')
const events = require('events')
const emitter = new events.EventEmitter()

const createPathFinder = require('./pathfinding/createPathFinder')
const createLightCaster = require('./lightcasting/createLightCaster')
const createEmptyBoard = require('./util/createEmptyBoard')

const defaultBoardWidth = 25
const defaultBoardHeight = 12

const priv = Symbol()

const board = JSON.parse(fs.readFileSync('./server/assets/levels/level1.json', 'utf8'))

let model = {
    priv : priv,
    [priv] : {
        board : board,
        applyLighting : true
    },
    board: createEmptyBoard(defaultBoardWidth, defaultBoardHeight),
    players: [
        {
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
            sightRange : 4,
            hp : {
                max: 10,
                current: 5
            }
        },
        {
            controlled: '',
            position: {
                x: 5,
                y: 3
            },
            className: 'mage',
            sightRange : 4,
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
    ],
    setTargetTo : require('./commands/setTargetTo')(emitter),
    endTurn : require('./commands/endTurn'),
    save : require('./commands/save'),
    setApplyLighting : require('./commands/setApplyLighting')(emitter),
    setTileTex : require('./commands/setTileTex')(emitter),
    setTileObstacle : require('./commands/setTileObstacle')(emitter)
}

let isObstacle = (x,y)=>{
    if(model.board.data[y*model.board.width + x].obstacle === true){
        return true
    //} else if(model.players !== undefined && model.players.find((el)=>{return el.position.x === x && el.position.y === y}) !== undefined){
    //    console.log('true 2')
    //    return true
    } else if(model.monsters !== undefined && model.monsters.find((el)=>{return el.position.x === x && el.position.y === y}) !== undefined){
        return true
    }
    return false
}

model.players.forEach((el)=>{
    el[priv] = {
        lightcaster: createLightCaster({
            width: defaultBoardWidth,
            height: defaultBoardHeight,
            isObstacle: isObstacle
        }),
        findPath: createPathFinder({
            width: defaultBoardWidth,
            height: defaultBoardHeight,
            isObstacle: isObstacle
        })
    }
})

require('./util/createMonsterTypes')(model)
require('./eventHandlers/invalidLight')(model, emitter)
require('./util/createRandomMonsters')({
    model : model,
    width : defaultBoardWidth,
    height : defaultBoardHeight,
    count : 10,
    isObstacle : isObstacle
})
emitter.emit('invalid-light')

module.exports = {
    onJoin: (ctx) =>{
        console.log('client joined '+ctx.name)
        if(model.players[0].controlled === ''){
            model.players[0].controlled = ctx.name
            ctx.set('controlledPlayer', model.players[0])
            console.log('...as APlayer')
        } else if(model.players[0].controlled === '') {
            model.players[1].controlled = ctx.name
            ctx.set('controlledPlayer', model.players[1])
            console.log('...as BPlayer')
        } else {
            console.log('...as Guest')
        }

        /*ctx.on('update','monsters,*,position',(path)=>{
            const monsterId = path[1]
            const monster  = ctx.model.monsters[monsterId]

            ctx.model.players.forEach((player)=>{
                if(distance(player.position, monster.position) < player.sightRange){
                    ctx.unhide('monsters,'+monsterId+',position')
                    ctx.unhide('monsters,'+monsterId+',typeIndex')
                    ctx.unhide('monsters,'+monsterId+',target')
                } else {
                    ctx.hide('monsters,'+monsterId+',position')
                    ctx.hide('monsters,'+monsterId+',typeIndex')
                    ctx.hide('monsters,'+monsterId+',target')
                }
            })

        })

        ctx.on('update','players,*,position',(path)=>{
            const playerId = path[1]
            const monster  = ctx.model.monsters[playerId]

            ctx.model.players.forEach((player)=>{
                if(distance(player.position, monster.position) < player.sightRange){
                    ctx.unhide('monsters,'+monsterId+',position')
                    ctx.unhide('monsters,'+monsterId+',typeIndex')
                    ctx.unhide('monsters,'+monsterId+',target')
                } else {
                    ctx.hide('monsters,'+monsterId+',position')
                    ctx.hide('monsters,'+monsterId+',typeIndex')
                    ctx.hide('monsters,'+monsterId+',target')
                }
            })

        })*/

    },
    onLeave: (ctx) =>{
        if(ctx.has('controlledPlayer')){
            ctx.get('controlledPlayer').controlled = ''
        }
        console.log('client leaved '+ctx.name)
    },
    onChanges : (ctx, changes)=>{
        changes.filter((el)=>{
            console.log(el.path)
            return true
        })
        return changes
    },
    model : model
}
