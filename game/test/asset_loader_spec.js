'use strict'
var path = require('path')
var load = require('../src/asset_loader')

describe("A suite", function() {
  it("contains spec with an expectation", function(done) {

    var assetPath = path.normalize(__dirname,'/../assets/')

    var level = load(assetPath).then(function(assets){
      //expect(level.waves.length).toBe(3);
      console.error(assets)
      done(true)
    })
})
