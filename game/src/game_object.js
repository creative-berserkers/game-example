'use strict'

const sessions = new Map()
const games = new Map()

const self = {
    numberOfSessions : Number(sessions.size),
    registerSession(ctx, uniqueId) {
        let session = sessions.get(uniqueId)
        if (session !== undefined) {
            session.ctx.disconnect()
        }
        
        ctx.onDisconnect(()=>{
            console.log('client left: ' + ctx.name)
            self.numberOfSessions--
        })
        
        session = {
            ctx,
            uniqueId,
            api : {
                accepted: true,
                join(username){
                    return {
                        id : 12345
                    }
                }
            }
        }
        sessions.set(uniqueId, session)
        console.log('client joined: ' + ctx.name)
        self.numberOfSessions++
        
        
        ctx.sync(session.api)
        
        return session.api
    }
}

exports.index = self