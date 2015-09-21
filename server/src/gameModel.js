'use strict'

const fs = require('fs');

const defaultBoardWidth = 25
const defaultBoardHeight = 12

const model = {
    board: JSON.parse(fs.readFileSync('./server/assets/levels/level1.json', 'utf8')),
    units: [
        {
            name: 'PlayerA',
            controllable: 'human',
            position: {
                x: 0,
                y: 0
            },
            class_name : 'warrior',
            hp : {
                max: 10,
                current: 5
            }
        },
        {
            name: 'PlayerB',
            controllable: 'human',
            position: {
                x: 0,
                y: 1
            },
            class_name: 'mage',
            hp : {
                max: 10,
                current: 8
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
        fs.writeFile("./server/assets/levels/level1.json", JSON.stringify(model.board, null, 2),'utf8', function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    },
    loadBoard(){
        /*fs.readFile( "./server/assets/levels/level1.json", function (err, data) {
            if (err) {
                throw err;
            }
            model.board = JSON.parse(data.toString());
        });*/

        return 'board loaded'
    },
    createBoard(){
        return 'board created'
    },
    setTileTex(ctx, spec){
        const pos = {
            x : Number(spec.position.x),
            y : Number(spec.position.y)
        }
        const layer = spec.layer
        const tex = spec.newTex

        const tile = model.board.data[model.board.width*pos.y + pos.x]

        tile.layers[layer] = tex
        return `tile ${pos.x},${pos.y} on layer ${layer} set to ${tex}`
    },
    setTileObstacle(ctx, spec){
        const pos = {
            x : Number(spec.position.x),
            y : Number(spec.position.y)
        }
        const obstacle = spec.obstacle

        const tile = model.board.data[model.board.width*pos.y + pos.x]
        tile.obstacle = obstacle
        return `tile ${pos.x},${pos.y} obstacle set to ${obstacle}}`
    }
}

module.exports = model;
