'use strict'
const R = require('ramda')

const endTurn = require('./commands/endTurn')
const save = require('./commands/save')
const setApplyLighting = require('./commands/setApplyLighting')
const setTileObstacle = require('./commands/setTileObstacle')
const setTargetTo = require('./commands/setTargetTo')
const setTileTex = require('./commands/setTileTex')
const handshake = require('./commands/handshake')
const disconnect = require('./commands/disconnect')


module.exports = function createCommandMapping(model){

    return {
        endTurn : endTurn,
        save :  R.curry(setTileObstacle)(model.board),
        setApplyLighting : R.curry(setTileObstacle)(model),
        setTargetTo : R.curry(setTargetTo)(model.players),
        setTileObstacle : R.curry(setTileObstacle)(model.board),
        setTileTex : R.curry(setTileObstacle)(model.board),
        handshake : R.curry(handshake)(model),
        disconnect : R.curry(disconnect)(model)
    }
}
