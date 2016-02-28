'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomPosition(isOccupied, width, height, maxTries = 100) {
    for(let i=0; i<maxTries; ++i){
        let x = getRandomInt(0, width)
        let y = getRandomInt(0, height)

        if(!isOccupied(x,y)){
            return {x,y}
        }
    }
    return {x:0,y:0}
}

module.exports = {
    getRandomInt : getRandomInt,
    getRandomPosition : getRandomPosition
}
