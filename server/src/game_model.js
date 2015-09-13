'use strict'

var fs = require('fs');

const createArray = (width, height)=> {
    var arr = [];
    for (var i = 0; i < width*height; i++) {
        arr.push({
            id: i,
            layers : {
                floor : "floor_441",
                middle : "",
                ceiling : ""
            },
            obstacle: false
        });
    }
    return arr;
}

const defaultBoardWidth = 25
const defaultBoardHeight = 12

const model = {
    board: {
        width: defaultBoardWidth,
        height: defaultBoardHeight,
        data: createArray(defaultBoardWidth, defaultBoardHeight)
    },
    players: [
        {
            name: 'PlayerA',
            position: {
                x: 0,
                y: 0
            }
        },
        {
            name: 'PlayerB',
            position: {
                x: 0,
                y: 1
            }
        }
    ],
    takeControll(ctx, playerName){
        model.players.some((el)=> {
            if (el.name === playerName) {
                ctx.controlledPlayer = el
                return true
            }
        })
    },
    goTo(ctx, x, y){
        if (ctx.controlledPlayer === undefined) {
            return;
        }
        ctx.controlledPlayer.position.x = x
        ctx.controlledPlayer.position.y = y
    },
    endTurn(ctx) {
        console.log('turn ended');
    },
    save(ctx){
        fs.writeFile("./server/assets/levels/level1.json", JSON.stringify(model.board, null, 2), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    },
    load(){
        fs.readFile( "./server/assets/levels/level1.json", function (err, data) {
            if (err) {
                throw err;
            }
            model.board = JSON.parse(data.toString());
        });
    }
}

module.exports = model;
