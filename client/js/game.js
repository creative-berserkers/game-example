'use strict'
/*global PIXI */

const R = require('ramda')
const EventEmitter = require('eventemitter3');
const setupGame = require('./setup')
const io = require('socket.io-client')
const createProxyFunction = require('cb-proxy')
const createKeyboardMappings = require('./core/createKeyboardMappings')
const createHyperionClient = require('cb-hyperion').createHyperionClient
const createBoard = require('./core/createBoard')
const createPlayer = require('./core/createPlayer')
const createMonster = require('./core/createMonster')
const createTargetPointer = require('./core/createTargetPointer')
const createConsole = require('./console/createConsole')
const createEditor = require('./editor/createEditor')
const createInterpreter = require('./console/createInterpreter')

document.addEventListener('DOMContentLoaded', function () {

    const debug = true
    const init = (graphicsCtx) => {

        //start of new code
        const socket = io('https://localhost:8443', {secure : true})
        //client side
        socket.on('news', function (data) {
            console.log(data);
            socket.emit('my other event', { my: 'data' });
        });


        let rpc = R.curry(createProxyFunction)((name, args, callback)=>{
            socket.emit('call',{name, args}, callback)
        })

        let localProxyMethod1 = rpc('method1')
        let localProxyMethod2 = rpc('method2')

        localProxyMethod1('hello world').then((result)=>{console.log(result)})
        debugger
        /*let serverFunctions = [
            'setTargetTo',
            'endTurn',
            'save',
            'setApplyLighting',
            'setTileTex',
            'setTileObstacle',
            'myTestFunction'
        ]

        let proxy = R.curry(createProxyFunction)((name, args, callback)=>{
            socket.emit('call', {name : name , args : args}, (error, message) => callback(error, message))
        })

        let clientObject = R.reduce((a , b) => a[b] = proxy(b), {}, serverFunctions)
        clientObject.myTestFunction('test')
        // end of new code

        let client = createHyperionClient({
            host: 'wss://' + location.host
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
                name : '0',
                parent : board.container()
            })

            createTargetPointer({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                emiter : emiter,
                name : '1',
                parent : board.container()
            })

            clientCtx.model.monsters.forEach((el, index)=>{
                createMonster({
                    clientCtx : clientCtx,
                    graphicsCtx : graphicsCtx,
                    emiter : emiter,
                    id : index,
                    parent : board.container()
                })
            })

            createPlayer({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                emiter : emiter,
                name : '0',
                parent : board.container()
            })

            createPlayer({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                emiter : emiter,
                name : '1',
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
        })*/
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
            },
            {
                name: 'humanoid0',
                url: '/assets/img/Characters/Humanoid0.png'
            },
            {
                name: 'humanoid1',
                url: '/assets/img/Characters/Humanoid1.png'
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
