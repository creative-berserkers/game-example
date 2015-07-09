var fs = require('fs');

export default function loadSkills(){
  fs.readdir(../assets/skills, function(err, items) {
    console.log(items);

    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
    }
});
}
