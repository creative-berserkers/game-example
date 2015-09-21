'use strict'
/*global PIXI */

const EventEmitter = require('eventemitter3');
const setupGame = require('./setup')
const createKeyboardMappings = require('./core/createKeyboardMappings')
const createHyperionClient = require('cb-hyperion').createHyperionClient
const createBoard = require('./core/createBoard')
const createConsole = require('./core/createConsole')
const createEditor = require('./editor/createEditor')
const createInterpreter = require('./core/createInterpreter')

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
            createBoard({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                emiter : emiter
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

