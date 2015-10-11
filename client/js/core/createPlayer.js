/**
 * Created by odrin on 23.09.2015.
 */
'use strict'
/*global PIXI */

module.exports = function createPlayer(spec){
    const clientCtx = spec.clientCtx
    const graphicsCtx = spec.graphicsCtx
    const emiter = spec.emiter
    const name = spec.name
    const parent = spec.parent

    const stage = graphicsCtx.stage
    const model = clientCtx.model
    const resources = graphicsCtx.resources
    const player = model.players[name]
    const frames = resources[player.className].frames
    const frameWidth = resources[player.className].frameWidth

    const playerContainer = new PIXI.Container()
    playerContainer.position.x = Number(player.position.x) * frameWidth
    playerContainer.position.y = Number(player.position.y) * frameWidth


    const directions = {
        up : Symbol(),
        down : Symbol(),
        left : Symbol(),
        right : Symbol(),
        iddle : Symbol()
    }

    clientCtx.createChangeListener({
        path:['players',name, 'position'],
        onChange : (path, oldValue, newValue, next)=>{
            playerContainer.position.x = Number(newValue.x) * frameWidth
            playerContainer.position.y = Number(newValue.y) * frameWidth
            next()
        }
    })


    let createAnimation = (frames, visible)=>{
        let animation = new PIXI.extras.MovieClip(frames)
        animation.visible = visible
        animation.animationSpeed = 0.1
        animation.gotoAndPlay(0)
        playerContainer.addChild(animation)
    }

    let animations = {}
    animations[directions.down] = createAnimation([frames[0], frames[1], frames[2], frames[3]], true)
    animations[directions.left] = createAnimation([frames[4], frames[5], frames[6], frames[7]], false)
    animations[directions.right] = createAnimation([frames[8], frames[9], frames[10], frames[11]], false)
    animations[directions.up] = createAnimation([frames[12], frames[13], frames[14], frames[15]], false)

    parent.addChild(playerContainer)
}