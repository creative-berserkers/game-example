'use strict'

const createEmptyBoard = function createEmptyBoard(width, height){
    let data = []
    for(let i=0; i<width * height; ++i){
        data.push({
            id: i,
            layers: {
                floor: 'fogofwar_0',
                middle: 'fogofwar_0',
                ceiling: 'fogofwar_0'
            },
            obstacle: false,
            visibility: 'none'
        })
    }

    return {
        width : width,
        height : height,
        data : data,
        isObstacle : (x,y)=>{
            if(data[y*width + x].obstacle === true){
                return true
            }
            return false
        }
    }
}

const defaultBoardWidth = 25
const defaultBoardHeight = 12

let model = {
    priv : priv,
    board: createEmptyBoard(defaultBoardWidth, defaultBoardHeight),
    players: [
        {
            controlled: '',
            position: {
                x: 3,
                y: 3
            },
            className : 'mage',
            target : {
                path: [],
                position :{
                    x : 0,
                    y : 0
                }
            },
            sightRange : 4,
            hp : {
                max: 10,
                current: 5
            }
        },
        {
            controlled: '',
            position: {
                x: 5,
                y: 3
            },
            className: 'mage',
            sightRange : 4,
            target : {
                path: [],
                position :{
                    x : 0,
                    y : 0
                }
            },
            hp : {
                max: 10,
                current: 8
            }
        }
    ]
}

module.exports = model
