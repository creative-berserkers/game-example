/**
 * Created by odrin on 23.09.2015.
 */
'use strict'
/*global PIXI */

module.exports = function createTargetPointer(spec){
    const clientCtx = spec.clientCtx
    const graphicsCtx = spec.graphicsCtx
    const emiter = spec.emiter
    const name = spec.name
    const parent = spec.parent

    const resources = graphicsCtx.resources
    const model = clientCtx.model
    const player = model.players[name]
    const frameWidth = resources[player.className].frameWidth

    const pathContainer = new PIXI.Container()
    parent.addChild(pathContainer)
    const pathWithSteps = []

    const selectTexture = (previous, current, next)=>{
        if(previous === undefined){
            if(current.y === next.y){
                if(current.x < next.x){
                    return resources.walking.frames[11]
                } else {
                    return resources.walking.frames[8]
                }
            }
            if(current.x === next.x){
                if(current.y < next.y){
                    return resources.walking.frames[10]
                } else {
                    return resources.walking.frames[5]
                }
            }
        }
        if(next === undefined){
            if(current.y === previous.y){
                if(current.x < previous.x){
                    return resources.walking.frames[11]
                } else {
                    return resources.walking.frames[8]
                }
            }
            if(current.x === previous.x){
                if(current.y < previous.y){
                    return resources.walking.frames[10]
                } else {
                    return resources.walking.frames[5]
                }
            }
        }
        if(previous.x === next.x){
            return resources.walking.frames[12]
        }
        if(previous.y === next.y){
            return resources.walking.frames[2]
        }
        if(previous.y - next.y === -1 && previous.x - next.x === -1){
            if(previous.y === current.y){
                return resources.walking.frames[6]
            } else {
                return resources.walking.frames[3]
            }

        }
        if(previous.y - next.y === 1 && previous.x - next.x === 1){
            if(previous.y === current.y){
                return resources.walking.frames[3]
            } else {
                return resources.walking.frames[6]
            }
        }
        if(previous.y - next.y === 1 && previous.x - next.x === -1){
            if(previous.y === current.y){
                return resources.walking.frames[7]
            } else {
                return resources.walking.frames[9]
            }
        }
        if(previous.y - next.y === -1 && previous.x - next.x === 1){
            if(previous.y === current.y){
                return resources.walking.frames[9]
            } else {
                return resources.walking.frames[7]
            }
        }
        return resources.walking.frames[2]
    }

    const updatePath = (path)=>{
        while(pathWithSteps.length < path.length){
            let pathStep = new PIXI.Sprite(resources.walking.frames[2])
            pathWithSteps.push(pathStep)
            pathContainer.addChild(pathStep)
        }
        path.forEach((step, i)=>{
            let pathStep = pathWithSteps[i]
            pathStep.position.x = step.x * frameWidth
            pathStep.position.y = step.y * frameWidth
            pathStep.texture = selectTexture(path[i-1], path[i], path[i+1])
            pathStep.visible = true
        })
        for( let i = path.length; i < pathWithSteps.length ; ++i){
            pathWithSteps[i].visible = false
        }
    }
    clientCtx.createChangeListener({
        path:['players',name,'target', 'path'],
        onChange : (path, oldValue, newValue, next)=>{
            updatePath(newValue)
            next()
        }
    })

    let disableInput = false

    let targetId = name === 'aPlayer' ? 0 : 1
    const targetPointer = new PIXI.Sprite(resources.walking.frames[targetId])
    targetPointer.position.x = player.target.position.x * frameWidth
    targetPointer.position.y = player.target.position.y * frameWidth
    parent.addChild(targetPointer)

    clientCtx.createChangeListener({
        path:['players',name,'target', 'position'],
        onChange : (path, oldValue, newValue, next)=>{
            targetPointer.position.x = Number(newValue.x) * frameWidth
            targetPointer.position.y = Number(newValue.y) * frameWidth
            next()
        }
    })
}