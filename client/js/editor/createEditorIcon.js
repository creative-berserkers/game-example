/**
 * Created by odrin on 21.09.2015.
 */
'use strict'
/*global PIXI */

module.exports = function createEditorIcon(spec){
    const graphicsCtx = spec.graphicsCtx
    const resources = graphicsCtx.resources
    const selectable = spec.selectable
    const onClick = spec.onClick
    const position = spec.position
    const frame = spec.frame
    const parent = spec.parent

    const iconContainer = new PIXI.Container()
    iconContainer.hitArea = new PIXI.Rectangle(0, 0, 16, 16);
    iconContainer.interactive = true
    iconContainer.buttonMode = true
    iconContainer.position = position

    const background = new PIXI.Sprite(resources.editor.frames[frame])
    background.position.x = 0
    background.position.y = 0
    iconContainer.addChild(background)

    const selected = new PIXI.Sprite(resources.editor.frames[0])
    selected.position.x = 0
    selected.position.y = 0
    selected.visible = false
    iconContainer.addChild(selected)

    iconContainer.on('mousedown', ()=>{
        if(selectable){
            selected.visible = !selected.visible
            onClick(selected.visible)
        } else {
            onClick()
        }
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