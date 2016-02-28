'use strict'

const createPathFinder = require('./pathfinding/createPathFinder')
const createRandomBoard = require('./model/createRandomBoard')

const defaultBoardWidth = 25
const defaultBoardHeight = 12

module.exports = function() {
    const model = {
        board: createRandomBoard(defaultBoardWidth, defaultBoardHeight),
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
                },
                _findPath : createPathFinder({
                    width: defaultBoardWidth,
                    height: defaultBoardHeight,
                    isObstacle: (x,y) => { model.board.isObstacle(x,y) }
                })
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
                },
                _findPath : createPathFinder({
                    width: defaultBoardWidth,
                    height: defaultBoardHeight,
                    isObstacle: (x,y) => {model.board.isObstacle(x,y)}
                })
            }
        ]
    }

    return model
}
