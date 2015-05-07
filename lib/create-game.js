exports.createGame = ()=>{
    return {
        players : [
            {
                name : "player-a",
                health : 10,
                mana : 10,
                actions : {
                    max : 5,
                    current : 5
                },
                position : {
                    x : 0,
                    y : 0
                },
                melee : "sword",
                skills : ["heal","fireball"]
            }
        ],
        entities : [
            {
                stand : "friendly",
                health : 10,
                mana : 0,
                actions : {
                    max : 5,
                    current : 5
                },
                position : {
                    x : 0,
                    y : 0
                },
                melee : "sword",
                skills : []
            }
        ],
        melee : [
            {
                name : "sword",
                desc: "Simple sword with attack 3",
                power : 3,
                pasive : [],
                special : []
            }
        ],
        skills : [
            {
                name : "heal",
                amount : 3,
                cost : 5
            },
            {
                name : "fireball",
                power : 3,
                cost : 5
            },
            {
                name : "switch-places"
            }
        ]
    }
}
