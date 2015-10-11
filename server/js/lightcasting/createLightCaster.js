'use strict'

const createShadow = require('./createShadow')
const createShadowLine = require('./createShadowLine')

module.exports = function createLightCaster(spec){
    const mapWidth = spec.width
    const mapHeight = spec.height
    const isObstacle = spec.isObstacle

    const transformOctant = [
        (row, col)=>({x :col,y:-row}),
        (row, col)=>({x :row,y:-col}),
        (row, col)=>({x :row,y:col}),
        (row, col)=>({x :col,y:row}),

        (row, col)=>({x :-col,y:row}),
        (row, col)=>({x :-row,y:col}),
        (row, col)=>({x :-row,y:-col}),
        (row, col)=>({x :-col,y:-row})
    ]

    const map = []
    for(let i=0;i<mapWidth*mapHeight; ++i){
        map.push(0)
    }

    const isInsideMap = (pos)=>{
        return (pos.x >= 0 && pos.x < mapWidth) && (pos.y >= 0 && pos.y <mapHeight)
    }

    const setTile = (pos, val)=>{
        map[pos.y*mapWidth+pos.x] = val
    }

    const clearMap = ()=>{
        for(let i=0;i<mapWidth*mapHeight; ++i){
            map[i] = 0
        }
    }

    const projectTile = (col, row) => {
        let topLeft = col / (row + 2)
        let bottomRight = (col + 1) / (row + 1)
        return createShadow({
            start: topLeft,
            end:bottomRight
        })
    }

    const refreshOctant = (lightPos, octant) => {
        const line = createShadowLine()
        let fullShadow = false

        for (let row = 0;; row++) {
            // Stop once we go out of bounds.
            let octantPos = transformOctant[octant](row, 0)
            let pos = {
                    x : lightPos.x + octantPos.x,
                    y : lightPos.y + octantPos.y
                }
            if (!isInsideMap(pos)){
                break
            }

            for (let col = 0; col <= row; col++) {

                octantPos = transformOctant[octant](row, col)
                pos = {
                    x : lightPos.x + octantPos.x,
                    y : lightPos.y + octantPos.y
                }
                //console.log(`calculating col:${col} row:${row} x:${pos.x} y:${pos.y}`)
                // If we've traversed out of bounds, bail on this row.
                if (!isInsideMap(pos)){
                    break
                }

                if (fullShadow) {
                    setTile(pos,0)
                } else {
                    let projection = projectTile(col, row)

                    // Set the visibility of this tile.
                    let visible = !line.isInShadow(projection)
                    setTile(pos, visible? 1 : 0)

                    // Add any opaque tiles to the shadow map.
                    if (visible && isObstacle(pos.x, pos.y)) {
                        line.add(projection)
                        fullShadow = line.isFullShadow()
                    }
                }
            }
        }
    }

    const refreshVisibility = (pos) => {
        for (let octant = 0; octant < 8; octant++) {
            refreshOctant(pos, octant)
        }
    }

    return {
        calculateFrom : function(x,y){
            clearMap()
            refreshVisibility({
                x : x,
                y : y
            })
            return map
        },
        isVisible: function(x,y) {
            return map[y*mapWidth+x] === 1
        }
    }
}