'use strict'

function resize(canvas, ratio) {
    let w = 0
    let h = 0
    let topOffset = 0
    let leftOffset = 0
    if (window.innerWidth / window.innerHeight >= ratio) {
        w = window.innerHeight * ratio
        h = window.innerHeight
        leftOffset = (window.innerWidth - w)/2
    } else {
        w = window.innerWidth
        h = window.innerWidth / ratio
        topOffset = (window.innerHeight - h)/2
    }
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    canvas.style.marginTop = topOffset + 'px'
    canvas.style.marginLeft = leftOffset + 'px'
}

module.exports = function createOnResizeHandler(spec){
    const canvas = spec.canvas
    if(!canvas) {
        throw 'canvas must not be undefined or null'
    }
    const ratio = spec.ratio

    resize(canvas, ratio)

    return function() {
        resize(canvas, ratio)
    }
}