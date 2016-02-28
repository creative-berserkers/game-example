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
const createChangeHandler = require('./createChangeHandler')
const createGUI = require('./core/createGUI')

document.addEventListener('DOMContentLoaded', function () {

    const debug = true
    const init = (graphicsCtx) => {

        const emiter = new EventEmitter()

        createKeyboardMappings({
            emiter: emiter
        })

        //start of new code
        const socket = io('https://localhost:8443', {secure : true})

        let rpc = R.curry(createProxyFunction)((name, args, callback)=>{
            socket.emit('call',{name, args}, callback)
        })

        const methods = {
            handshake : rpc('handshake'),
            setTargetTo : rpc('setTargetTo')
        }

        let changeHandler = undefined
        let modelRef = undefined

        const onStart = (model)=>{
            console.log('received model',model)
            methods.handshake().then(console.log)

            graphicsCtx.stage.removeChildren()

            modelRef = model
            changeHandler = createChangeHandler()

            const clientCtx = {
                model : model,
                createChangeListener : (spec) =>{
                    changeHandler.registerHandler(spec)
                }
            }

            const board = createBoard({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                methods : methods,
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

            /*clientCtx.model.monsters.forEach((el, index)=>{
                createMonster({
                    clientCtx : clientCtx,
                    graphicsCtx : graphicsCtx,
                    emiter : emiter,
                    id : index,
                    parent : board.container()
                })
            })*/

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

            createGUI({
                clientCtx : clientCtx,
                graphicsCtx : graphicsCtx,
                methods : methods,
                emiter : emiter,
                parent : graphicsCtx.stage
            })

            /*const guiConsole = createConsole({
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
            })*/
        }

        const changesToProcess = []
        let processing = false
        const process = ()=>{
            if(changesToProcess.length !== 0 && processing !== true){
                processing = true
                let change = changesToProcess.shift()
                if(change.type === 'update'){
                    R.path(R.dropLast(1,change.path), modelRef)[R.last(change.path)] = change.newValue
                    changeHandler.fireOnChangeEvent({
                        path : change.path,
                        oldValue : change.oldValue,
                        newValue : change.newValue,
                        next : ()=>{
                            processing = false
                            setTimeout(process, 0)
                        }
                    })
                }
            }
        }

        socket.on('model', onStart)
        socket.on('model-update', (changes)=>{
            changes.forEach((change)=>{
                changesToProcess.push(change)
            })
            setTimeout(process,0)
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
            },
            {
                name: 'humanoid0',
                url: '/assets/img/Characters/Humanoid0.png'
            },
            {
                name: 'humanoid1',
                url: '/assets/img/Characters/Humanoid1.png'
            },
            {
                name: 'walk_btn',
                url: '/assets/img/GUI/walk_btn.png',
                width : 64
            },
            {
                name: 'attack_btn',
                url: '/assets/img/GUI/attack_btn.png',
                width : 64
            },
            {
                name: 'end_turn_btn',
                url: '/assets/img/GUI/end_turn_btn.png',
                width : 64
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
