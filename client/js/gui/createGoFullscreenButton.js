'use strict'

module.exports = function createGoFullscreenButton(spec){

    const canvas = spec.canvas
    if(!canvas) {
        throw 'canvas must not be undefined or null'
    }

    function RequestFullscreen(elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
        }
        else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen()
        }
        else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen()
        }
        else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen()
        }
    }

    var btn = document.createElement('BUTTON')
    var t = document.createTextNode('Go To Fullscreen')
    btn.appendChild(t)
    btn.onclick = function(){
        RequestFullscreen(canvas)
    }
    btn.style.position = 'absolute'
    btn.style.left = '10px'
    btn.style.top = '5px'
    btn.style.height = '50px'
    btn.style.opacity = '0.5'
    
    return btn
}