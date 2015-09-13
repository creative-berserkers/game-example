'use strict'
/*global PIXI */

const setup = require('./setup')
const createNautilusClient = require('./nautilus')

document.addEventListener('DOMContentLoaded', function () {

    const assets = {}
    const init = (stage, resources) => {


        const board = new PIXI.Container()
        board.position.x = 48
        board.position.y = 48

        createNautilusClient({
            host: 'ws://' + location.host,
            onIndex: function (model) {
                console.log('received index object')
                console.log(model)

                model.board.data.forEach((el, i)=> {

                    const tile = new PIXI.Container()
                    tile.anchor.x = 0.5
                    tile.anchor.y = 0.5
                    tile.position.x = (i % model.board.width) * resources.floor.frameWidth
                    tile.position.y = Math.floor(i / model.board.width) * resources.floor.frameHeight

                    if(el.data.layers.floor !== ''){
                        const sp = el.data.layers.floor.split('_')
                        const floor = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
                        tile.addChild(floor)
                    }

                    if(el.data.layers.middle !== ''){
                        const sp = el.data.layers.middle.split('_')
                        const middle = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
                        tile.addChild(middle)
                    }

                    if(el.data.layers.ceiling !== ''){
                        const sp = el.data.layers.middle.split('_')
                        const ceiling = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
                        tile.addChild(ceiling)
                    }

                    board.addChild(tile)
                })

                stage.addChild(board)
            }
        })
    }

    const update = (delta)=> {
        //assets.bunny.rotation += (delta/1000)
    }

    setup({
        assets: [{
            name: 'floor',
            url: '/assets/img/Objects/Floor.png'
        }],
        init: init,
        update: update,
        viewport: {
            width: 1920,
            height: 1080
        },
        scale: 4
    })
});

