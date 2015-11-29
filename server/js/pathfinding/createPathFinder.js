/**
 * Created by odrin on 23.09.2015.
 */
'use strict'

module.exports = function createPathFinder(spec){
    const mapWidth = spec.width
    const mapHeight = spec.height
    const isObstacle = spec.isObstacle

    const map = new Array(mapWidth*mapHeight)
    for(let i=0;i<mapWidth*mapHeight; ++i){
        map[i] = {
            score:-1,
            done :false
        }
    }

    const clearMap = ()=>{
        for(let i=0;i<mapWidth*mapHeight; ++i){
            let el = map[i]
            el.score = -1
            el.done  = false
        }
    }

    const getTarget = (x, y) => {
        return map[y*mapWidth+x]
    }

    const isInsideMap = (x, y)=>{
        return (x >= 0 && x < mapWidth) && (y >= 0 && y < mapHeight)
    }

    const directions = [{x:0,y:-1}, {x:1,y:0},{x:0,y:+1},{x:-1,y:0}]

    const precalculateFrom = (from)=>{

        clearMap()

        let stackToSearch = [from]
        getTarget(from.x, from.y).score = 0
        getTarget(from.x, from.y).done = true
        while(stackToSearch.length !== 0){
            let pos = stackToSearch.shift()
            let score = getTarget(pos.x, pos.y).score

            directions.forEach((delta)=>{
                let x = pos.x + delta.x
                let y = pos.y + delta.y
                if(isInsideMap(x, y) && !isObstacle(x, y)){
                    let target = getTarget(x,y)
                    if(target.score === -1 || target.score > score+1){
                        target.score = score+1
                    }
                    if(!target.done){
                        stackToSearch.push({
                            x : x,
                            y : y
                        })
                        target.done = true
                    }
                }
            })
        }
        return true
    }

    const findPrecalculatedPath = (from, to)=>{

        if(from.x === to.x && from.y === to.y ||
            isObstacle(from.x, from.y) ||
            isObstacle(to.x, to.y)){
            return []
        }
        precalculateFrom(from)
        if(getTarget(to.x, to.y).score === -1){
            return []
        }

        let current = to
        let path = [to]
        while(!(current.x === from.x && current.y === from.y)){
            let newCurrent = directions.reduce((prev, delta)=>{
                let prevScore = getTarget(prev.x, prev.y).score
                let x = current.x + delta.x
                let y = current.y + delta.y
                if(isInsideMap(x, y) && getTarget(x,y).score !== -1 && getTarget(x,y).score < prevScore){
                    return {
                        x : x,
                        y : y
                    }
                }
                return prev
            }, current)
            path.unshift(newCurrent)
            current = newCurrent
        }
        return path
    }

    return findPrecalculatedPath
}