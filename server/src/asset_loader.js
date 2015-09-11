var System = require('systemjs')
var path = require('path')
var Promise = require("bluebird");
var fs = require("q-io/fs");

System.transpiler = '';

module.exports = {
  levels: [
    require("../assets/levels/level1.js"),
    require("../assets/levels/level2.js")
  ],
  skills: [
    require("../assets/skills/move.js"),
    require("../assets/skills/pact_with_the_devil.js")
  ],
  bindings: require("../assets/bindings.js")
}