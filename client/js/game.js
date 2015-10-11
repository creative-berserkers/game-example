'use strict'
/*global PIXI */

const EventEmitter = require('eventemitter3');
const setupGame = require('./setup')
const createKeyboardMappings = require('./core/createKeyboardMappings')
const createHyperionClient = require('cb-hyperion').createHyperionClient
const createBoard = require('./core/createBoard')
const createPlayer = require('./core/createPlayer')
const createTargetPointer = require('./core/createTargetPointer')
const createConsole = require('./console/createConsole')
const createEditor = require('./editor/createEditor')
const createInterpreter = require('./console/createInterpreter')

document.addEventListener('DOMContentLoaded', function () {

    const debug = true
    const init = (graphicsCtx) => {
        let client = createHyperionClient({
            host: 'ws://' + location.host
        })

        const emiter = new EventEmitter()

        createKeyboardMappings({
            emiter: emiter
        })

        client.then((clientCtx) => {
            const board = createBoard({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                emiter : emiter,
                parent : graphicsCtx.stage
            })

            createTargetPointer({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                emiter : emiter,
                name : 'aPlayer',
                parent : board.container()
            })

            createTargetPointer({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                emiter : emiter,
                name : 'bPlayer',
                parent : board.container()
            })

            createPlayer({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                emiter : emiter,
                name : 'aPlayer',
                parent : board.container()
            })

            createPlayer({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                emiter : emiter,
                name : 'bPlayer',
                parent : board.container()
            })

            const guiConsole = createConsole({
                graphicsCtx : graphicsCtx,
                emiter : emiter
            })

            const interpreter = createInterpreter({
                clientCtx: clientCtx
            })

            guiConsole.setInputListener((command)=>{
                const result = interpreter.interpret(command)
                if(result instanceof Promise){
                    result.then((r)=>{
                        guiConsole.writeLine(r)
                    })
                } else {
                    guiConsole.writeLine(result)
                }
            })

            const editor = createEditor({
                graphicsCtx : graphicsCtx,
                clientCtx : clientCtx,
                emiter : emiter
            })
        },(error)=>{
            console.log(error)
        })
    }

    const update = (delta)=> {
        //assets.bunny.rotation += (delta/1000)
    }

    setupGame({
        assets: [
            {
                name: 'floor',
                url: '/assets/img/Objects/Floor.png'
            },
            {
                name: 'debug',
                url: '/assets/img/Development/debug.png'
            },
            {
                name: 'wall',
                url: '/assets/img/Objects/Wall.png'
            },
            {
                name: 'warrior',
                url: '/assets/img/Commissions/Warrior.png'
            },
            {
                name: 'editor',
                url: '/assets/img/Editor/EditorControls.png'
            },
            {
                name: 'mage',
                url: '/assets/img/Commissions/Mage.png'
            },
            {
                name: 'walking',
                url: '/assets/img/Other/Walking.png'
            },
            {
                name: 'tile',
                url: '/assets/img/Objects/Tile.png'
            },
            {
                name: 'fogofwar',
                url: '/assets/img/Other/FogOfWar.png'
            }
        ],
        init: init,
        update: update,
        viewport: {
            width: 1920,
            height: 1080
        },
        scale: 3
    })
});

