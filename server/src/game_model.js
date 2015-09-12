'use strict'

const createArray = (width, height)=>{
    const array = new Array(width*height)
    array.map((el)=>{return 0})
    return array;
}

const defaultBoardWidth = 10
const defaultBoardHeight = 6

const model = {
    board : {
        width : defaultBoardWidth,
        height : defaultBoardHeight,
        data : createArray(defaultBoardWidth, defaultBoardHeight),
    },
    players : [
        {
            name : 'PlayerA',
            position : {
                x : 0,
                y : 0
            }
        },
        {
            name : 'PlayerB',
            position : {
                x : 0,
                y : 1
            }
        }
    ],
    takeControll(ctx, playerName){
        model.players.some((el)=>{
            if(el.name === playerName){
                ctx.controlledPlayer = el
                return true
            }
        })
    },
    goTo(ctx, x,y){
        if(ctx.controlledPlayer === undefined){
            return;
        }
        ctx.controlledPlayer.position.x = x
        ctx.controlledPlayer.position.y = y
    },
    endTurn(ctx) {
        console.log('turn ended');
    }
}

module.exports = model;
