export default skill = {
  properties : {
    range: 10,
    effectiveness: 20,
    heal: 10,
    type: "unholy",
    base_dmg: 4,
    total_dmg: "{{base_dmg}} + Math.floor({{effectiveness}}*player.attr.int/100)"
  },
  flags : [
    "can_be_equipped",
    "can_be_dropped"
  ],
  description : "All enemies in range {{range}} will take {{total_dmg}}dmg ({{base_dmg}} base damage + {{effectiveness}}% of {{type}} damage}}) if target dies you are being healed for {{heal}}% of his max HP.",
  handler : function(board, player){
      board.selectInRange({
        position: player.position,
        range: this.properties.range,
        type:"all"
      }).forEach((target)=>{
          let dmg = {
            source : player,
            type : this.properties.type,
            amount: this.properties.total_dmg
          }
          if(target.isLethalDmg(dmg)){
            player.heal(0.1*target.attr.maxHp)
          }
          target.takeDmg(dmg);
        })
    }
}
