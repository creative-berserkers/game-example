/**
 * Created by odrin on 21.09.2015.
 */
'use strict'
/*global PIXI */

const createEditorIcon = require('./createEditorIcon')

module.exports = function createTileSetPalette(spec){
    const graphicsCtx = spec.graphicsCtx
    const resources = graphicsCtx.resources
    const onClick = spec.onClick
    const position = spec.position
    const parent = spec.parent
    let tileset = spec.tileset;

    const tileSetPaletteContainer = new PIXI.Container()
    tileSetPaletteContainer.position = position
    parent.addChild(tileSetPaletteContainer)

    let nextPaletteButton
    let prevPaletteButton

    let palette = []
    let offset = 0
    let offsetStep = 21

    const update = ()=>{
        palette.forEach((el, i)=>{
            if(i+offset < resources[tileset].frames.length){
                el.texture = resources[tileset].frames[i+offset]
            } else {
                el.texture = resources.wall.frames[5]
            }
        })
    }

    nextPaletteButton = createEditorIcon({
        parent : tileSetPaletteContainer,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 6,
        position : {
            x : 400,
            y : 0
        },
        onClick : ()=>{
            offset = offset + offsetStep
            update()
        }
    })

    prevPaletteButton = createEditorIcon({
        parent : tileSetPaletteContainer,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 7,
        position : {
            x : 0,
            y : 0
        },
        onClick : ()=>{
            offset = offset - offsetStep
            if(offset < 0){
                offset = 0
            }
            update()
        }
    })

    for(let i=0; i< offsetStep ; ++i){
        let p
        if(i < resources[tileset].frames.length){
            p = new PIXI.Sprite(resources[tileset].frames[i])
        } else {
            p = new PIXI.Sprite(resources.wall.frames[5])
        }
        p.position.x = 20 + (i * (16 + 2))
        p.position.y = 0
        palette.push(p)
        tileSetPaletteContainer.addChild(p)
    }

    return {
        setTileSet : (ts)=>{
            tileset = ts
            offset = 0
            update()
        }
    }
}