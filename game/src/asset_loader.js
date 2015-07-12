var System = require('systemjs');
//import {Promise} from 'promise'

export default function load(cb){
  /*let allLevels = Promise.all([

  ])

  let allAssets = Promise.all([
    allLevels
  ]).then(function(assets){
    console.log(assets)
    cb(assets)
  })*/

  //System.transpiler = 'babel';

  System.import(__dirname+'/../assets/levels/level1.js').then(function(data){
    console.error('xxxx');
    cb(data);
  },function (e) {
        console.error(e);
  })
}
