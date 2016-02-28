'use static'

const Random = require('../util/Random')

module.exports = function createEmptyBoard(width, height){

    let data = []
    for(let i=0; i<width * height; ++i){
        data.push({
            id: i,
            layers: {
                floor: 'floor_337',
                middle: 'floor_4',
                ceiling: 'floor_4'
            },
            obstacle: false,
            visible: true
        })
    }

    for(let i=0; i<30; ++i){
        let x = Random.getRandomInt(0,width)
        let y = Random.getRandomInt(0,height)
        data[y*width + x].layers.middle = 'floor_68'
        data[y*width + x].obstacle = true
    }

    return {
        width : width,
        height : height,
        data : data,
        isObstacle : (x,y)=>{
            return data[y*width + x].obstacle
        }
    }
}
