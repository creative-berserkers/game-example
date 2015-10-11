/**
 * Created by odrin on 23.09.2015.
 */
'use strict'

module.exports = function createPathFinder(spec){
    const mapWidth = spec.width
    const mapHeight = spec.height
    const isObstacle = spec.isObstacle

    const map = []
    for(let i=0;i<mapWidth*mapHeight; ++i){
        map.push({
            score:-1,
            done :false
        })
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

    const lastFrom = {
        x : -1,
        y : -1
    }
    const precalculateFrom = (from)=>{
        if(lastFrom.x === from.x && lastFrom.y === from.y){
            return false
        }
        lastFrom.x = from.x
        lastFrom.y = from.y

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

    const dumpData = (current, path, from , to)=>{
        console.log(current)
        console.log(path)
        console.log(`from ${from.x}, ${from.y} to:${to.x}, ${to.y}`)
        console.log('Score: ----------------------------------------------')
        for(let y=0;y<mapHeight;++y){
            let line = ''
            for(let x=0;x<mapWidth;++x){
                line += map[y*mapWidth+x].score+' '
            }
            console.log(line)
        }
        console.log('Done: ----------------------------------------------')
        for(let y=0;y<mapHeight;++y){
            let line = ''
            for(let x=0;x<mapWidth;++x){
                line += (map[y*mapWidth+x].done === true ? 1 : 0)+' '
            }
            console.log(line)
        }
    }

    const findPrecalculatedPath = (from, to)=>{
        let current = to
        let path = [to]
        let counter = 0
        while(!(current.x === from.x && current.y === from.y)){
            counter ++
            if(counter > mapWidth * mapHeight + 20){
                dumpData(current, path, from , to)
                return path
            }
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


    return {
        findPath(from, to){
            if(from.x === to.x && from.y === to.y){
                return []
            }
            if(isObstacle(from.x, from.y)){
                return []
            }
            if(isObstacle(to.x, to.y)){
                return []
            }
            let skipped = precalculateFrom(from)
            if(getTarget(to.x, to.y).score === -1){
                return []
            }
            return findPrecalculatedPath(from, to)
        },
        invalidateCache : ()=>{
            lastFrom.x = -1
            lastFrom.y = -1
        }
    }
}