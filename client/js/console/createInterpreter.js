/**
 * Created by odrin on 15.09.2015.
 */
'use strict'

module.exports = function createInterpreter(spec){

    const clientCtx = spec.clientCtx
    const model = clientCtx.model

    const commands = new Map()
    const Any = Symbol()

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    const validateFormat = (args,format)=>{
        return format.every((el,i)=>{
            if(el === Number){
                return isNumeric(args[i])
            }
            if(el === String){
                return args[i] !== undefined
            }
            if(el === Any){
                return true
            }
        })
    }

    const getUseExample = (command, format) => {
        return command + ' '+format.reduce((prev, curr)=>{return prev+' <'+(curr===Any?'?':curr.name)+'> '},"")
    }

    commands.set('help', {
        format : [Any],
        description : 'Prints help about given command or list of available commands.',
        handler:(args)=> {
            if (args.length === 0) {
                const keys = [];
                for (let key of commands.keys()) {
                    keys.push(key)
                }
                return `You can use following commands: ${keys}. Type help <command> to find more information.`
            } else if(args.length === 1 && commands.has(args[0])){
                return getUseExample(args[0],commands.get(args[0]).format) +': '+ commands.get(args[0]).description
            }
        }
    })

    commands.set('createBoard', {
        format : [String,Number,Number],
        description : 'Creates new empty board with given name and dimensions.',
        handler : (args)=>{
            return model.createBoard({
                name : args[0],
                width : args[1],
                height : args[2]
            })
        }
    })

    commands.set('loadBoard', {
        format : [String],
        description : 'Loads given board into current game.',
        handler : (args)=>{
            return model.loadBoard({
                name : args[0],
                width : args[1],
                height : args[2]
            })
        }
    })

    commands.set('setTileTex', {
        format : [Number, Number, String, String],
        description : 'Set tile at given location, layer to new texture.',
        handler : (args)=>{
            return model.setTileTex({
                position : {
                    x : args[0],
                    y : args[1]
                },
                layer : args[2],
                newTex : args[3]
            })
        }
    })

    return {
        interpret(command){
            const comParts = command.split(' ')
            const cmdDescr = commands.get(comParts[0])
            if(cmdDescr) {
                const args = comParts.slice(1,comParts.length)
                if(validateFormat(args,cmdDescr .format)){
                    return cmdDescr.handler(args)
                } else {
                    return commands.get('help').handler([comParts[0]])
                }
            }
            return `Command '${comParts[0]}' not found! Type help to get list of commands.`
        }
    }
}
