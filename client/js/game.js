'use strict'
/*global PIXI */

const setup = require('./setup')
const createNautilusClient = require('./nautilus')
const createBoard = require('./core/createBoard')
const createConsole = require('./core/createConsole')
const createInterpreter = require('./core/createInterpreter')

document.addEventListener('DOMContentLoaded', function () {

    const debug = true
    const init = (stage, resources, renderer) => {
        createNautilusClient({
            host: 'ws://' + location.host,
            onIndex: function (model) {
                const board = createBoard({
                    model: model,
                    resources: resources,
                    debug : debug,
                    stage : stage
                })


                const guiConsole = createConsole({
                    renderer : renderer,
                    stage : stage
                })

                const interpreter = createInterpreter({
                    model: model
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
            }
        })
    }

    const update = (delta)=> {
        //assets.bunny.rotation += (delta/1000)
    }

    setup({
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

