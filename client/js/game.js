'use strict'
/*global PIXI */

const setup = require('./setup')
const createNautilusClient = require('./nautilus')

document.addEventListener('DOMContentLoaded', function () {

    const assets = {}
    const init = (stage) => {
        assets.bunny = new PIXI.Sprite(PIXI.Texture.fromImage("/assets/bunny.png"))

        assets.bunny.anchor.x = 0.5
        assets.bunny.anchor.y = 0.5

        assets.bunny.position.x = 50
        assets.bunny.position.y = 30
        stage.addChild(assets.bunny)

        const board = new PIXI.Container()

        createNautilusClient({
            host : 'ws://' + location.host,
            onIndex : function(model){
                console.log('received index object')
                console.log(model)

                model.board.data.forEach((el, i)=>{
                    const tile = new PIXI.Sprite(PIXI.Texture.fromImage("/assets/bunny.png"))
                    tile.anchor.x = 0.5
                    tile.anchor.y = 0.5
                    tile.position.x = (i%model.board.width)*32
                    tile.position.y = Math.floor(i/model.board.width)*32
                    board.addChild(tile)
                })

                stage.addChild(board)
            }
        })
    }

    const update = (delta)=>{
        assets.bunny.rotation += (delta/1000)
    }

    setup({
        init: init,
        update: update,
        viewport : {
            width : 1920,
            height : 1080
        },
        scale : 4
    })
});

