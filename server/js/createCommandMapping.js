'use strict'
const R = require('ramda')
const createPathFinder = require('./pathfinding/createPathFinder')

const endTurn = require('./commands/endTurn')
const save = require('./commands/save')
const setApplyLighting = require('./commands/setApplyLighting')
const setTileObstacle = require('./commands/setTileObstacle')
const setTargetTo = require('./commands/setTargetTo')
const setTileTex = require('./commands/setTileTex')


module.exports = function createCommandMapping(model){
    let findPath = createPathFinder({
        width: dmodel.board.width,
        height: model.board.height,
        isObstacle: model.board.isObstacle
    }

    return {
        endTurn : endTurn,
        save :  R.curry(setTileObstacle)(model.board),
        setApplyLighting : R.curry(setTileObstacle)(model),
        setTargetTo : R.curry(setTargetTo)(model.players, findPath),
        setTileObstacle : R.curry(setTileObstacle)(model.board),
        setTileTex : R.curry(setTileObstacle)(model.board)
    }
}
