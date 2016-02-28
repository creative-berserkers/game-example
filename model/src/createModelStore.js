const R = requre('ramda')
const createStore = require('redux').createStore

const ADD_PLAYER = require('./actions/ADD_PLAYER')
const MOVE_UNIT = require('./actions/MOVE_UNIT')

/*const initialGameState = {
    board : {
        width : 0,
        height : 0,
        data : []
    },
    players : [],
    units : [{
        id : 'test-unit',
        position : {
            x: 10,
            y: 20
        },
        target : {
            position : {
                x : -1,
                y : -1
            },
            path : []
        }
    }]
}*/

const createModel = (state = initialGameState, action)=>{
    switch(action.type){
        ADD_PLAYER.type : Object.assign({},state, {
            players : [...state.players, action.player]
        })
        MOVE_UNIT.type : Object.assign({},state,{
            units : R.update(action.id, Object.assign({},state.units[action.id], {
                position : action.position
            }, state.units)
        })
        default : state
    }
}

module.exports = function createModelStore(initialGameState){
    return createStore(createModel, initialGameState)
}
