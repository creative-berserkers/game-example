/**
 * Created by odrin on 30.09.2015.
 */
'use strict'

module.exports = function createShadowLine(){

    const shadows = []

    return Object.freeze({
        isInShadow : (projection) => {
            for (let i=0; i < shadows.length; i++) {
                if (shadows[i].contains(projection)){
                    return true
                }
            }
            return false
        },
        isFullShadow : () => {
            return shadows.length === 1 && shadows[0].start === 0 && shadows[0].end === 1
        },
        add : (shadow) => {
            // Figure out where to slot the new shadow in the list.
            let index = 0
            for (; index < shadows.length; index++) {
                // Stop when we hit the insertion point.
                if (shadows[index].start >= shadow.start){
                    break
                }
            }

            // The new shadow is going here. See if it overlaps the
            // previous or next.
            let overlappingPrevious
            if (index > 0 && shadows[index - 1].end > shadow.start) {
                overlappingPrevious = shadows[index - 1]
            }

            let overlappingNext
            if (index < shadows.length &&
                shadows[index].start < shadow.end) {
                overlappingNext = shadows[index]
            }

            // Insert and unify with overlapping shadows.
            if (overlappingNext !== undefined) {
                if (overlappingPrevious !== undefined) {
                    // Overlaps both, so unify one and delete the other.
                    overlappingPrevious.end = overlappingNext.end
                    shadows.splice(index, 1)
                } else {
                    // Overlaps the next one, so unify it with that.
                    overlappingNext.start = shadow.start
                }
            } else {
                if (overlappingPrevious !== undefined) {
                    // Overlaps the previous one, so unify it with that.
                    overlappingPrevious.end = shadow.end
                } else {
                    // Does not overlap anything, so insert.
                    shadows.splice(index, 0,shadow)
                }
            }
        }

    })
}