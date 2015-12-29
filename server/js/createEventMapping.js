'use strict'
const R = require('ramda')
const globalVisible = require('./events/globalVisible')
const anyPlayerPosition = require('./events/anyPlayerPosition')

module.exports = function createEventMapping(model, broadcast){
    return {
        global :{
            visible : R.curry(globalVisible)(model,broadcast)
        },
        rel :{
            players : {
                __any__ : {
                    position : R.curry(anyPlayerPosition)(model,broadcast)
                }
            }
        }
    }
}
