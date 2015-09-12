'use strict'
/*global PIXI */

const createOnResizeHandler = require('./core/createOnResizeHandler')
const createGoFullscreenButton = require('./gui/createGoFullscreenButton')

module.exports = function setup(spec){

    const initCb = spec.init || (()=>{})
    const updateCb = spec.update || (()=>{})
    const viewport = spec.viewport || {width : 1920, height : 1080}
    const scale = spec.scale

    const ratio = viewport.width / viewport.height
    const renderer = new PIXI.autoDetectRenderer(viewport.width, viewport.height,{
        antialias : false
    })
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST

    const stage = new PIXI.Container()

    stage.scale.x = scale
    stage.scale.y = scale
    stage.position.x = 0
    stage.position.y = 0

    document.body.appendChild(renderer.view)
    document.body.appendChild(createGoFullscreenButton({
        canvas : renderer.view
    }))

    window.onresize = createOnResizeHandler({
        canvas : renderer.view,
        ratio : ratio
    })

    initCb(stage)

    let lastTime = Date.now()
    let timeSinceLastFrame = 0

    function animate() {
        requestAnimationFrame(animate)
        var now = Date.now()
        timeSinceLastFrame = now - lastTime
        updateCb(timeSinceLastFrame)
        lastTime = now

        renderer.render(stage)
    }
    requestAnimationFrame(animate)
}
