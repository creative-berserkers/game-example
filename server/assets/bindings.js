'use strict'

let self = module.export = [
  {
    name : "move_up",
    on_event : "move_up_row",
    trigger : {
      type : "skill",
      name : "move",
      properties : {
        direction : "up"
      }
    }
  },
  {
    name : "move_down",
    on_event : "move_down_row",
    trigger : {
      type : "skill",
      name : "move",
      properties : {
        direction : "down"
      }
    }
  }
]
