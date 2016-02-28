'use strict'

const expect = require('expect')
const createModelStore = require('../src/createModelStore')
const MOVE_UNIT = require('../src/actions/MOVE_UNIT')

const initialGameState = {
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
}

const state = modelStore.getState()
const modelStore = createModelStore(initialGameState)

expect(state).toEqal(initialGameState)

modelStore.dispatch(MOVE_UNIT)
