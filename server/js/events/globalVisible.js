'use strict'

module.exports = function globalVisible(model, broadcast, path, parent, oldVisible, newVisible){
    if(oldVisible === false && newVisible === true){
        broadcast({
            type : 'update',
            path : path.slice(0,-1)
            newValue : parent            
        })
    }
}
