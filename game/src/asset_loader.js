var System = require('systemjs')
var path = require('path')
var Promise = require("bluebird");
var fs = require("fs");
Promise.promisifyAll(fs);

exports = function load(path){
  fs.statAsync(path).then(function(stat){

  })
}
