/**
 * Created by odrin on 18.10.2015.
 */
'use strict'

module.exports = function createEmptyBoard(width, height){
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
        data : data
    }
}