/**
 * Created by odrin on 30.09.2015.
 */
'use strict'

module.exports = function createShadow(spec){

    let start = spec.start
    let end = spec.end

    return {
        contains : (other) => {
            return start <= other.start && end >= other.end
        },
        start : start,
        end : end
    }
}