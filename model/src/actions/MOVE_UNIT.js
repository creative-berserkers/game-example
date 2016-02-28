'use strict'

module.exports = function(id, position){
    return {
        type : 'MOVE_UNIT',
        id,
        position
    }
}
