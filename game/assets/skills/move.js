export default {
  properties : {
    direction: "up"
  },
  description : "Move current player in {{direction}} direction",
  flags : [
    "can_be_triggered_by_event"
  ],
  cost : {
    movePoints : 1
  },
  handler(board, player){
      if(this.properties.direction === "up"){
        if(player.rank === 10){
          player.logger.warn("player_cant_move_above_10_rank")
        } else {
          player.rank = player.rank++
        }
      } else if(this.properties.direction === "down"){
        if(player.rank === 0){
          player.logger.warn("player_cant_move_below_0_rank")
        } else {
          player.rank = player.rank--
        }
      }
    }
}
