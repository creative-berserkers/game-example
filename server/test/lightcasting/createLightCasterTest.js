/**
 * Created by odrin on 03.10.2015.
 */
'use strict'
const createLightCaster = require('../../js/lightcasting/createLightCaster')
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
        const LightCaster = createLightCaster({
            width : 8,
            height : 8,
            isObstacle : (x,y)=>{
                return map[y*8+x] === 1
            }
        })

        const result = LightCaster.calculateFrom(4,4)

        expect(result).to.eql([
            //  0 1 2 3 4 5 6 7
            0,0,0,1,1,1,0,0, //0
            0,0,0,1,1,1,0,0, //1
            0,0,0,1,1,1,0,0, //2
            0,0,0,1,1,1,0,0, //3
            0,0,0,1,1,1,0,0, //4
            0,0,0,1,1,1,0,0, //5
            0,0,0,0,0,0,0,0, //6
            0,0,0,0,0,0,0,0  //7
        ])
    })
})