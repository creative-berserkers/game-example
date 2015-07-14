'use strict'

const sessions = new Map()
const mapWidth = 32
const mapHeight = 32


const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const selectRandomPosition = (players, w, h) => {
    const randomX = getRandomInt(0,w);
    const randomY = getRandomInt(0,h);
    
    if(players.some((el)=>{
        return (el.posX === randomX && el.posY === randomY);
    })){
        return selectRandomPosition(players,w,h)
    } else {
        return {
            posX : randomX,
            posY : randomY
        }
    }
}

const self = {
    numberOfSessions : Number(sessions.size),
    players : {
        list : []
    },
    registerSession(ctx, uniqueId, playername) {
        let session = sessions.get(uniqueId)
        if (session !== undefined) {
            session.ctx.disconnect()
        }
        
        ctx.onDisconnect(()=>{
            console.log('client left: ' + ctx.name)
            self.numberOfSessions--
            
            for(var i = self.players.list.length -1; i >= 0 ; i--){
                if(self.players.list[i].id === ctx.name){
                    self.players.list.splice(i, 1);
                }
            }
        })
        
        session = {
            ctx,
            uniqueId
        }
        
        sessions.set(uniqueId, session)
        console.log('client joined: ' + ctx.name)
        self.numberOfSessions++
        
        self.players.list.push({
            name : playername,
            id : ctx.name,
            score : 0,
            position : selectRandomPosition(self.players.list, mapWidth, mapHeight) 
        });
    }
}

exports.index = self