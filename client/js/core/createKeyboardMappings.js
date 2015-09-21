/**
 * Created by odrin on 21.09.2015.
 */
'use strict'

module.exports = function createKeyboardMappings(spec){
    const emiter = spec.emiter

    const keyboardMappings = [
        {
            keyboardCode : 54,
            eventToEmit : 'r4two:action:tile-editor'
        },
        {
            keyboardCode : 55,
            eventToEmit : 'r4two:action:obstacle-editor'
        },
        {
            keyboardCode : 192,
            eventToEmit : 'r4two:action:console'
        },
        {
            keyboardCode : 13,
            eventToEmit : 'r4two:action:accept'
        },
        {
            keyboardCode : 38,
            eventToEmit : 'r4two:action:up'
        },
        {
            keyboardCode : 40,
            eventToEmit : 'r4two:action:down'
        }
    ]

    window.onkeyup = function(e) {
        const key = e.keyCode ? e.keyCode : e.which

        keyboardMappings.forEach((el)=>{
            if(el.keyboardCode === key){
                emiter.emit(el.eventToEmit)
            }
        })
    }
}