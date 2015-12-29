/**
 * Created by odrin on 19.10.2015.
 */
'use strict'

module.exports = function createRandomMonsters(spec){
    const model = spec.model
    const priv = model.priv
    const width = spec.width
    const height = spec.height
    const count = spec.count
    const isObstacle = spec.isObstacle

    const monsterTypes = model.monsterTypes

    model.monsters = []

    let getRandomArbitrary = (min, max)=>{
        return Math.floor(Math.random() * (max - min)) + min
    }

    let pickRandomPosition = ()=>{
        while(true){
            let x = getRandomArbitrary(0, width-1)
            let y = getRandomArbitrary(0, height-1)
            if(!isObstacle(x,y) && !model.monsters.find((el)=>{return el.position.x === x && el.position.y === y})){
                return {x,y}
            }
        }
    }

    for(let i=0;i<count;++i){
        model.monsters.push({
            [priv] : {
                position : pickRandomPosition(),
                typeIndex : getRandomArbitrary(0,monsterTypes.length)
            },
            position: {x:-1, y:-1},
            visible : false,
            typeIndex: -1,
            target: {
                path: [],
                position: {
                    x: -1,
                    y: -1
                }
            },
            hp: {
                max: 10,
                current: 10
            }
        })
    }
}
