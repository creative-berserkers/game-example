/**
 * Created by odrin on 20.10.2015.
 */
'use strict'
/*global PIXI */

module.exports = function createMonster(spec){
    const clientCtx = spec.clientCtx
    const graphicsCtx = spec.graphicsCtx
    const emiter = spec.emiter
    const id = spec.id
    const parent = spec.parent

    const stage = graphicsCtx.stage
    const model = clientCtx.model
    const resources = graphicsCtx.resources
    const monster = model.monsters[id]

    let initialized = false
    let frames0
    let frames1
    let frameWidth
    let monsterContainer

    let createAnimation = (frames, visible)=>{
        let animation = new PIXI.extras.MovieClip(frames)
        animation.visible = visible
        animation.animationSpeed = 0.1
        animation.gotoAndPlay(0)
        monsterContainer.addChild(animation)
    }

    const init = (monsterTypes, index)=>{
        let type = monsterTypes[index]
        let race = type.race+'0'
        let raceindex = type.index
        frames0 = resources[race].frames
        frames1 = resources[race].frames
        frameWidth = resources[race].frameWidth

        monsterContainer = new PIXI.Container()
        monsterContainer.position.x = Number(monster.position.x) * frameWidth
        monsterContainer.position.y = Number(monster.position.y) * frameWidth

        createAnimation([frames0[raceindex], frames1[raceindex]], true)

        parent.addChild(monsterContainer)
    }

    clientCtx.createChangeListener({
        path:['monsters',id, 'position'],
        onChange : (path, oldValue, newValue, next)=>{
            monsterContainer.position.x = Number(newValue.x) * frameWidth
            monsterContainer.position.y = Number(newValue.y) * frameWidth
            next()
        }
    })

    clientCtx.createChangeListener({
        path:['monsters',id, 'visible'],
        onChange : (path, oldValue, newValue, next)=>{
            if(initialized === false && monster.typeIndex !== -1){
                init(model.monsterTypes, monster.typeIndex)
            }
            if(monsterContainer) {
                monsterContainer.visible = newValue
            }

            next()
        }
    })

    if(!initialized && monster.visible === true && monster.typeIndex !== -1){
        init(model.monsterTypes, monster.typeIndex)
    }
}