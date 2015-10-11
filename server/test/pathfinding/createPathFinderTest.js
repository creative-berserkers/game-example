/**
 * Created by odrin on 23.09.2015.
 */
'use strict'
const createPathFinder = require('../../js/pathfinding/createPathFinder')
const expect = require('chai').expect
const assert = require('assert')

const map = [
//  0 1 2 3 4 5 6 7
    0,0,0,0,0,0,0,0, //0
    0,0,0,1,0,1,0,0, //1
    0,1,1,1,0,1,0,0, //2
    0,1,0,1,0,1,0,0, //3
    0,1,0,1,0,1,0,0, //4
    0,1,1,1,1,1,0,0, //5
    0,0,0,0,0,0,0,0, //6
    0,0,0,0,0,0,0,0  //7
]

describe('createPathFinder Test', function() {
    it('should find correct path', function() {
        const PathFinder = createPathFinder({
            width : 8,
            height : 8,
            isObstacle : (x,y)=>{
                return map[y*8+x] === 1
            }
        })

        const path = PathFinder.findPath({x:4,y:4},{x:6,y:5})

        expect(path).to.eql([
            {x:4,y:4},
            {x:4,y:3},
            {x:4,y:2},
            {x:4,y:1},
            {x:4,y:0},
            {x:5,y:0},
            {x:6,y:0},
            {x:6,y:1},
            {x:6,y:2},
            {x:6,y:3},
            {x:6,y:4},
            {x:6,y:5}
        ])
    })

    it('should return empty path', function() {
        const PathFinder = createPathFinder({
            width : 8,
            height : 8,
            isObstacle : (x,y)=>{
                return map[y*8+x] === 1
            }
        })

        const path = PathFinder.findPath({x:4,y:0},{x:4,y:0})

        expect(path).to.eql([])
    })

    it('should return correct path', function() {
        const PathFinder = createPathFinder({
            width : 8,
            height : 8,
            isObstacle : (x,y)=>{
                return map[y*8+x] === 1
            }
        })

        const path = PathFinder.findPath({x:4,y:1},{x:4,y:0})

        expect(path).to.eql([{x:4,y:1},{x:4,y:0}])
    })

    it('should not find path', function() {
        const PathFinder = createPathFinder({
            width : 8,
            height : 8,
            isObstacle : (x,y)=>{
                return map[y*8+x] === 1
            }
        })

        const path = PathFinder.findPath({x:2,y:3},{x:0,y:3})

        expect(path).to.eql([])
    })

    it('should not find path', function() {
        const PathFinder = createPathFinder({
            width : 8,
            height : 8,
            isObstacle : (x,y)=>{
                return map[y*8+x] === 1
            }
        })

        const path = PathFinder.findPath({x:1,y:2},{x:0,y:2})

        expect(path).to.eql([])
    })

    it('should not find path', function() {
        const PathFinder = createPathFinder({
            width : 8,
            height : 8,
            isObstacle : (x,y)=>{
                return map[y*8+x] === 1
            }
        })

        const path = PathFinder.findPath({x:0,y:2},{x:1,y:2})

        expect(path).to.eql([])
    })
})