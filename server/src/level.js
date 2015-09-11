var System = require('systemjs');

export default function load(){
  return System.import('..assets/levels/level1')
}
