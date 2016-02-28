'use strict'

module.exports = function(id, name, controll, selectedUnit){
    return {
        type : 'ADD_PLAYER',
        player {
            id,
            name,
            controll,
            selectedUnit
        }
    }
}
