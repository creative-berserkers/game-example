'use strict'

const createActionStack = require('createActionStack')

exports.createUnit = () => {
    return {
        position : {
            x : 0,
            y : 0
        },
        health : 10,
        attack : 3,
        move : 2,
        sight : 4,
        target : undefined,
        skills : [{
            name : 'punch',
            level : 0
        },{
            name : 'bow-shoot',
            level : 0
        }],
        activeSkill : 0,
        stance : {
            name : 'aggresive'
        },
        actionStack : (createActionStack([
            { name : 'findPath', executor : require('findpath') }
        ])),
        

        executeAction : (board) => {
            this.actionStack.execute({
                board : board,
                unit : this
            })
        },        
        moveTo : (position) => {
            this.actionStack.pushAction({
                action : 'findPath',
                target : position
            })
        },
        changeStance : (stance) => {
            this.stance = stance
        },
        takeDamage : (amount) =>{
            this.health = this.health - amount
        }
    }
}