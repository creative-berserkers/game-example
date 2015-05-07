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
            
        ],
        skills : [
        
        ]
    }
}
