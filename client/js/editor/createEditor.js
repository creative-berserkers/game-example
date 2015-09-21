/**
 * Created by odrin on 21.09.2015.
 */
'use strict'
/*global PIXI */

const createEditorIcon = require('./createEditorIcon')
const createTileSetPalette = require('./createTileSetPalette')

module.exports = function createEditor(spec){
    const graphicsCtx = spec.graphicsCtx
    const clientCtx = spec.clientCtx
    const emiter = spec.emiter
    const renderer = graphicsCtx.renderer
    const resources = graphicsCtx.resources
    const stage = graphicsCtx.stage
    let selectedEditor
    let selectedLayerEditor
    let currentSet = 0
    let sets = Object.getOwnPropertyNames(resources)

    const editorIndicator = new PIXI.Container()
    editorIndicator.position.x = 30
    editorIndicator.position.y = 10
    editorIndicator.visible = false
    stage.addChild(editorIndicator)

    let newBoardButton
    let saveBoardButton
    let reloadBoardButton

    let tileEditor
    let obstacleEditor

    let floorLayerButton
    let middleLayerButton
    let ceilingLayerButton

    let tileSetUpButton
    let tileSetDownButton

    let tileSetPalette

    const tileSetLabel = new PIXI.Text(`${sets[currentSet]} (${resources[sets[currentSet]].texture.width/16} x ${resources[sets[currentSet]].texture.height/16})`,
        {font : '16px Arial', fill : 0xffffff, align : 'center'});
    tileSetLabel.position.x = 216
    tileSetLabel.position.y = 0
    editorIndicator.addChild(tileSetLabel)

    tileSetUpButton = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 8,
        position : {
            x : 180,
            y : 0
        },
        onClick : ()=>{
            currentSet++
            if(currentSet >= sets.length){
                currentSet = 0
            }
            tileSetLabel.text = `${sets[currentSet]} (${resources[sets[currentSet]].texture.width/16} x ${resources[sets[currentSet]].texture.height/16})`
            tileSetPalette.setTileSet(sets[currentSet])
        }
    })

    tileSetDownButton = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 9,
        position : {
            x : 196,
            y : 0
        },
        onClick : ()=>{
            currentSet--
            if(currentSet < 0){
                currentSet = sets.length - 1
            }
            tileSetLabel.text = `${sets[currentSet]} (${resources[sets[currentSet]].texture.width/16} x ${resources[sets[currentSet]].texture.height/16})`
            tileSetPalette.setTileSet(sets[currentSet])
        }
    })

    floorLayerButton = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame: 3,
        position : {
            x : 112,
            y : 0
        },
        onClick : ()=>{
            middleLayerButton.deselect()
            ceilingLayerButton.deselect()
            selectedLayerEditor = floorLayerButton
        }
    })

    middleLayerButton = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame: 4,
        position : {
            x : 130,
            y : 0
        },
        onClick : ()=>{
            floorLayerButton.deselect()
            ceilingLayerButton.deselect()
            selectedLayerEditor = middleLayerButton
        }
    })

    ceilingLayerButton = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame: 5,
        position : {
            x : 148,
            y : 0
        },
        onClick : ()=>{
            floorLayerButton.deselect()
            middleLayerButton.deselect()
            selectedLayerEditor = ceilingLayerButton
        }
    })

    obstacleEditor = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame: 1,
        position : {
            x : 64,
            y : 0
        },
        onClick : ()=>{
            tileEditor.deselect()
            floorLayerButton.hide()
            middleLayerButton.hide()
            ceilingLayerButton.hide()
            tileSetDownButton.hide()
            tileSetUpButton.hide()
            tileSetLabel.visible = false
            selectedEditor = obstacleEditor
        }
    })

    tileEditor = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame : 2,
        position : {
            x : 82,
            y : 0
        },
        onClick : ()=>{
            obstacleEditor.deselect()
            floorLayerButton.show()
            middleLayerButton.show()
            ceilingLayerButton.show()
            tileSetDownButton.show()
            tileSetUpButton.show()
            tileSetLabel.visible = true
            selectedEditor = tileEditor
        }
    })

    newBoardButton = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 9,
        position : {
            x : 0,
            y : 0
        },
        onClick : ()=>{
        }
    })

    newBoardButton = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 12,
        position : {
            x : 0,
            y : 0
        },
        onClick : ()=>{
        }
    })

    saveBoardButton = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 10,
        position : {
            x : 18,
            y : 0
        },
        onClick : ()=>{
        }
    })

    reloadBoardButton = createEditorIcon({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 11,
        position : {
            x : 36,
            y : 0
        },
        onClick : ()=>{
        }
    })

    tileSetPalette = createTileSetPalette({
        parent : editorIndicator,
        graphicsCtx : graphicsCtx,
        position : {
            x : 0,
            y : 20
        },
        tileset : sets[currentSet],
        onClick : ()=>{
        }
    })

    selectedEditor = obstacleEditor
    floorLayerButton.hide()
    middleLayerButton.hide()
    ceilingLayerButton.hide()
    tileSetDownButton.hide()
    tileSetUpButton.hide()
    tileSetLabel.visible = false

    emiter.on('r4two:action:obstacle-editor',()=>{
        editorIndicator.visible = !editorIndicator.visible
        if(editorIndicator.visible){
            emiter.emit('r4two:editor:enabled')
        } else {
            emiter.emit('r4two:editor:disabled')
        }
    })

    emiter.on('r4two:board:tileselect', (tile)=>{
        if(!editorIndicator.visible) {
            return
        }
        if(selectedEditor === obstacleEditor){
            clientCtx.model.setTileObstacle({
                position : {
                    x : tile.position.x,
                    y : tile.position.y
                },
                obstacle : !tile.obstacle
            })
        }
    })

}