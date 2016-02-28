/**
 * Created by odrin on 21.09.2015.
 */
'use strict'
/*global PIXI */

module.exports = function createButton(spec){
    const graphicsCtx = spec.graphicsCtx
    const stateImages = spec.stateImages
    const onClick = spec.onClick
    const position = spec.position
    const size = spec.size
    const parent = spec.parent

    const iconContainer = new PIXI.Container()
    iconContainer.hitArea = new PIXI.Rectangle(0, 0, size.width, size.height);
    iconContainer.interactive = true
    iconContainer.buttonMode = true
    iconContainer.position = position

    const background = new PIXI.Sprite(stateImages.up)
    background.position.x = 0
    background.position.y = 0
    iconContainer.addChild(background)

    const selected = new PIXI.Sprite(stateImages.selected)
    selected.position.x = 0
    selected.position.y = 0
    selected.visible = false
    iconContainer.addChild(selected)

    iconContainer.on('mousedown', ()=>{
        onClick()
    })

    parent.addChild(iconContainer)


    return {
        deselect : ()=>{
            selected.visible = false
        },
        select : ()=>{
            selected.visible = true
        },
        hide : ()=>{
            iconContainer.visible = false
        },
        show : ()=>{
            iconContainer.visible = true
        }
    }
}
