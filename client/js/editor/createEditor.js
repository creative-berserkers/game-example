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

    const editorContainer = new PIXI.Container()
    editorContainer.position.x = 30
    editorContainer.position.y = 10
    editorContainer.visible = false
    stage.addChild(editorContainer)

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
    let currentMarker
    let currentTexId = 0

    let clearTileEditor

    const tileSetLabel = new PIXI.Text(`${sets[currentSet]} (${resources[sets[currentSet]].texture.width/16} x ${resources[sets[currentSet]].texture.height/16})`,
        {font : '16px Arial', fill : 0xffffff, align : 'center'});
    tileSetLabel.position.x = 226
    tileSetLabel.position.y = 0
    editorContainer.addChild(tileSetLabel)

    const notificationLabel = new PIXI.Text('',{font : '16px Arial', fill : 0xffffff, align : 'center'});
    notificationLabel.position.x = 10
    notificationLabel.position.y = 330
    notificationLabel.visible = false
    editorContainer.addChild(notificationLabel)

    const showNotification = (text)=>{
        notificationLabel.text = text
        notificationLabel.visible = true
        setTimeout(()=>{
            notificationLabel.text = ''
            notificationLabel.visible = false
        }, 2000)
    }

    tileSetUpButton = createEditorIcon({
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 8,
        position : {
            x : 190,
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
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 9,
        position : {
            x : 206,
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
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame: 3,
        position : {
            x : 122,
            y : 0
        },
        onClick : ()=>{
            middleLayerButton.deselect()
            ceilingLayerButton.deselect()
            emiter.emit('r4two:editor:show-obstacles', false)
            selectedLayerEditor = floorLayerButton
        }
    })

    middleLayerButton = createEditorIcon({
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame: 4,
        position : {
            x : 140,
            y : 0
        },
        onClick : ()=>{
            floorLayerButton.deselect()
            ceilingLayerButton.deselect()
            emiter.emit('r4two:editor:show-obstacles', true)
            selectedLayerEditor = middleLayerButton
        }
    })

    ceilingLayerButton = createEditorIcon({
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame: 5,
        position : {
            x : 158,
            y : 0
        },
        onClick : ()=>{
            floorLayerButton.deselect()
            middleLayerButton.deselect()
            emiter.emit('r4two:editor:show-obstacles', false)
            selectedLayerEditor = ceilingLayerButton
        }
    })

    obstacleEditor = createEditorIcon({
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame: 1,
        position : {
            x : 64,
            y : 0
        },
        onClick : ()=>{
            tileEditor.deselect()
            clearTileEditor.deselect()
            floorLayerButton.hide()
            middleLayerButton.hide()
            ceilingLayerButton.hide()
            tileSetDownButton.hide()
            tileSetUpButton.hide()
            tileSetLabel.visible = false
            tileSetPalette.hide()
            selectedEditor = obstacleEditor
            emiter.emit('r4two:editor:show-obstacles', true)
        }
    })

    tileEditor = createEditorIcon({
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame : 2,
        position : {
            x : 82,
            y : 0
        },
        onClick : ()=>{
            obstacleEditor.deselect()
            clearTileEditor.deselect()
            floorLayerButton.show()
            middleLayerButton.show()
            ceilingLayerButton.show()
            tileSetDownButton.show()
            tileSetUpButton.show()
            tileSetLabel.visible = true
            tileSetPalette.show()
            selectedEditor = tileEditor
            emiter.emit('r4two:editor:show-obstacles', false)
        }
    })

    clearTileEditor = createEditorIcon({
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        selectable: true,
        frame: 13,
        position : {
            x : 100,
            y : 0
        },
        onClick : ()=>{
            obstacleEditor.deselect()
            tileEditor.deselect()
            floorLayerButton.hide()
            middleLayerButton.hide()
            ceilingLayerButton.hide()
            tileSetDownButton.hide()
            tileSetUpButton.hide()
            tileSetLabel.visible = false
            tileSetPalette.hide()
            selectedEditor = clearTileEditor
            emiter.emit('r4two:editor:show-obstacles', true)
        }
    })

    newBoardButton = createEditorIcon({
        parent : editorContainer,
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
        parent : editorContainer,
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
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        selectable: false,
        frame: 10,
        position : {
            x : 18,
            y : 0
        },
        onClick : ()=>{
            clientCtx.model.save().then((result) => {
                showNotification(result)
            })
        }
    })

    reloadBoardButton = createEditorIcon({
        parent : editorContainer,
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
        parent : editorContainer,
        graphicsCtx : graphicsCtx,
        position : {
            x : 0,
            y : 20
        },
        tileset : sets[currentSet],
        onClick : (id)=>{
            currentTexId = id
            currentMarker.texture = resources[sets[currentSet]].frames[id]
        }
    })

    currentMarker = new PIXI.Sprite(resources[sets[currentSet]].frames[0])
    currentMarker.position.x = 400
    currentMarker.position.y = 0
    editorContainer.addChild(currentMarker)


    selectedEditor = obstacleEditor
    selectedEditor.select()
    floorLayerButton.hide()
    floorLayerButton.select()
    selectedLayerEditor = floorLayerButton
    middleLayerButton.hide()
    ceilingLayerButton.hide()
    tileSetDownButton.hide()
    tileSetUpButton.hide()
    tileSetLabel.visible = false
    tileSetPalette.hide()

    emiter.on('r4two:action:editor',()=>{
        editorContainer.visible = !editorContainer.visible
        if(editorContainer.visible){
            emiter.emit('r4two:editor:visible', true)
            emiter.emit('r4two:editor:show-obstacles', selectedEditor === obstacleEditor)
            clientCtx.model.setApplyLighting(false)
        } else {
            emiter.emit('r4two:editor:visible', false)
            emiter.emit('r4two:editor:show-obstacles', false)
            clientCtx.model.setApplyLighting(true)
        }

    })

    const selectedLayer = ()=>{
        if(selectedLayerEditor === floorLayerButton){
            return 'floor'
        } else if(selectedLayerEditor === middleLayerButton){
            return 'middle'
        } else if(selectedLayerEditor === ceilingLayerButton){
            return 'ceiling'
        }
    }

    emiter.on('r4two:board:tileselect', (tile)=>{
        if(!editorContainer.visible) {
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
        } else if(selectedEditor === tileEditor && currentTexId < resources[sets[currentSet]].frames.length){
            clientCtx.model.setTileTex({
                position : {
                    x : tile.position.x,
                    y : tile.position.y
                },
                layer : selectedLayer(),
                newTex : sets[currentSet]+'_'+currentTexId
            })
        } else if(selectedEditor === clearTileEditor){
            clientCtx.model.setTileTex({
                position : {
                    x : tile.position.x,
                    y : tile.position.y
                },
                layer : 'floor',
                newTex : 'floor_14'
            })
            clientCtx.model.setTileTex({
                position : {
                    x : tile.position.x,
                    y : tile.position.y
                },
                layer : 'middle',
                newTex : 'wall_5'
            })
            clientCtx.model.setTileTex({
                position : {
                    x : tile.position.x,
                    y : tile.position.y
                },
                layer : 'ceiling',
                newTex : 'wall_5'
            })
            clientCtx.model.setTileObstacle({
                position : {
                    x : tile.position.x,
                    y : tile.position.y
                },
                obstacle : false
            })
        }
    })

}