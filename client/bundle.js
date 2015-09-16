/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	/*global PIXI */
	
	const setup = __webpack_require__(1)
	const createNautilusClient = __webpack_require__(4)
	const createBoard = __webpack_require__(5)
	const createConsole = __webpack_require__(6)
	const createInterpreter = __webpack_require__(7)
	
	document.addEventListener('DOMContentLoaded', function () {
	
	    const debug = true
	    const init = (stage, resources, renderer) => {
	        createNautilusClient({
	            host: 'ws://' + location.host,
	            onIndex: function (model) {
	                const board = createBoard({
	                    model: model,
	                    resources: resources,
	                    debug : debug,
	                    stage : stage
	                })
	
	
	                const guiConsole = createConsole({
	                    renderer : renderer,
	                    stage : stage
	                })
	
	                const interpreter = createInterpreter({
	                    model: model
	                })
	
	                guiConsole.setInputListener((command)=>{
	                    const result = interpreter.interpret(command)
	                    if(result instanceof Promise){
	                        result.then((r)=>{
	                            guiConsole.writeLine(r)
	                        })
	                    } else {
	                        guiConsole.writeLine(result)
	                    }
	                })
	            }
	        })
	    }
	
	    const update = (delta)=> {
	        //assets.bunny.rotation += (delta/1000)
	    }
	
	    setup({
	        assets: [
	            {
	                name: 'floor',
	                url: '/assets/img/Objects/Floor.png'
	            },
	            {
	                name: 'debug',
	                url: '/assets/img/Development/debug.png'
	            },
	            {
	                name: 'wall',
	                url: '/assets/img/Objects/Wall.png'
	            },
	            {
	                name: 'warrior',
	                url: '/assets/img/Commissions/Warrior.png'
	            }
	        ],
	        init: init,
	        update: update,
	        viewport: {
	            width: 1920,
	            height: 1080
	        },
	        scale: 3
	    })
	});
	


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	/*global PIXI */
	
	const createOnResizeHandler = __webpack_require__(2)
	const createGoFullscreenButton = __webpack_require__(3)
	
	module.exports = function setup(spec) {
	
	    const assets = spec.assets || []
	    const initCb = spec.init || (()=> {
	        })
	    const updateCb = spec.update || (()=> {
	        })
	    const viewport = spec.viewport || {width: 1920, height: 1080}
	    const scale = spec.scale
	
	    const ratio = viewport.width / viewport.height
	    const renderer = new PIXI.autoDetectRenderer(viewport.width, viewport.height, {
	        antialias: false
	    })
	    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST
	
	    const stage = new PIXI.Container()
	
	    stage.scale.x = scale
	    stage.scale.y = scale
	    stage.position.x = 0
	    stage.position.y = 0
	
	    document.body.appendChild(renderer.view)
	    document.body.appendChild(createGoFullscreenButton({
	        canvas: renderer.view
	    }))
	
	    window.onresize = createOnResizeHandler({
	        canvas: renderer.view,
	        ratio: ratio
	    })
	
	    assets.forEach((el)=> {
	        PIXI.loader.add(el.name, el.url)
	    })
	
	    PIXI.loader
	        .on('progress', function (loader, loadedResource) {
	            console.log('Progress:', loader.progress + '%');
	        })
	        .after(function (resource, next) {
	            resource.frameWidth = 16
	            resource.frameHeight = 16
	            resource.frames = []
	
	            const height = resource.texture.height - (resource.texture.height%resource.frameHeight === 0 ? 0:resource.frameHeight)
	            const width = resource.texture.width - (resource.texture.width%resource.frameHeight === 0 ? 0:resource.frameHeight)
	
	            for (let y = 0; y < height; y += resource.frameHeight) {
	                for (let x = 0; x < width; x += resource.frameWidth) {
	                    resource.frames.push(new PIXI.Texture(resource.texture.baseTexture, new PIXI.Rectangle(x, y, resource.frameWidth, resource.frameHeight)));
	                }
	            }
	            next()
	        })
	        .load(function (loader, resources) {
	            initCb(stage, resources, renderer)
	        });
	
	    let lastTime = Date.now()
	    let timeSinceLastFrame = 0
	
	    function animate() {
	        requestAnimationFrame(animate)
	        var now = Date.now()
	        timeSinceLastFrame = now - lastTime
	        updateCb(timeSinceLastFrame)
	        lastTime = now
	
	        renderer.render(stage)
	    }
	
	    requestAnimationFrame(animate)
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict'
	
	function resize(canvas, ratio) {
	    let w = 0
	    let h = 0
	    let topOffset = 0
	    let leftOffset = 0
	    if (window.innerWidth / window.innerHeight >= ratio) {
	        w = window.innerHeight * ratio
	        h = window.innerHeight
	        leftOffset = (window.innerWidth - w)/2
	    } else {
	        w = window.innerWidth
	        h = window.innerWidth / ratio
	        topOffset = (window.innerHeight - h)/2
	    }
	    canvas.style.width = w + 'px'
	    canvas.style.height = h + 'px'
	    canvas.style.marginTop = topOffset + 'px'
	    canvas.style.marginLeft = leftOffset + 'px'
	    //canvas.width = w;
	    //canvas.height = h;
	}
	
	module.exports = function createOnResizeHandler(spec){
	    const canvas = spec.canvas
	    if(!canvas) {
	        throw 'canvas must not be undefined or null'
	    }
	    const ratio = spec.ratio
	
	    resize(canvas, ratio)
	
	    return function() {
	        resize(canvas, ratio)
	    }
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = function createGoFullscreenButton(spec){
	
	    const canvas = spec.canvas
	    if(!canvas) {
	        throw 'canvas must not be undefined or null'
	    }
	
	    function RequestFullscreen(elem) {
	        if (elem.requestFullscreen) {
	            elem.requestFullscreen()
	        }
	        else if (elem.msRequestFullscreen) {
	            elem.msRequestFullscreen()
	        }
	        else if (elem.mozRequestFullScreen) {
	            elem.mozRequestFullScreen()
	        }
	        else if (elem.webkitRequestFullscreen) {
	            elem.webkitRequestFullscreen()
	        }
	    }
	
	    var btn = document.createElement('BUTTON')
	    var t = document.createTextNode('Go To Fullscreen')
	    btn.appendChild(t)
	    btn.onclick = function(){
	        RequestFullscreen(canvas)
	    }
	    btn.style.position = 'absolute'
	    btn.style.left = '10px'
	    btn.style.top = '5px'
	    btn.style.height = '50px'
	    btn.style.opacity = '0.5'
	    
	    return btn
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = function(conf) {
	    if(conf.onIndex === undefined) {
	        throw new Error('onIndex must be callback')
	    }
	    var socket = conf.socket || new WebSocket(conf.host)
	    var response = Object.create(null,{})
	    var objects = Object.create(null,{})
	    var id = 0
	    var index = undefined
	    
	    function send(msg){
	        console.log('=>')
	        console.log(msg)
	        socket.send(JSON.stringify(msg))
	    }
	
	    function createProxyMethod(object, objectName, method) {
	        var curr = object
	        method.forEach(function(node) {
	            if (curr[node] === undefined) {
	                curr[node] = function() {
	                    var currId = id++
	
	                    var promise = new Promise(function(resolve, reject) {
	                        response[currId] = {
	                            resolve: resolve,
	                            reject: reject
	                        }
	                    })
	                    var msg = {
	                        type : 'object-call',    
	                        path : method,
	                        name : objectName,
	                        id : currId,
	                        args : Array.prototype.slice.call(arguments, 0)
	                    }
	                    send(msg)
	                    return promise
	                }
	            }
	            else {
	                curr = curr[node]
	            }
	        })
	
	    }
	    
	    function applyChange(object, change){
	        if(change.type === 'update'){
	            var curr = object
	            change.path.forEach(function(node){
	                if(change.path[change.path.length-1] === node){
	                    curr[node] = change.value
	                }
	                curr = curr[node]
	            })
	        } else if(change.type === 'splice'){
	            var curr = object
	            change.path.forEach(function(node){
	                if(change.path[change.path.length-1] === node){
	                    curr[node].splice.apply(curr[node],[change.index,change.removedCount].concat(change.added))
	                }
	                curr = curr[node]
	            })
	        }
	    }
	    
	    function applyChanges(object, changes){
	        changes.forEach(function(change){
	            applyChange(object, change)
	        })
	    }
	
	    var client = {
	        index: function() {
	            return index
	        }
	    }
	
	    socket.onopen = function(event) {
	        if (conf.onopen) conf.onopen(client);
	    }
	
	    socket.onmessage = function(event) {
	        function apply() {
	            var msg = JSON.parse(event.data)
	            console.log('<=')
	            console.log(msg)
	            if (msg.type === 'call-response') {
	                if(msg.synced === true && objects[msg.resultName] === undefined){
	                    msg.methods.forEach(function(method) {
	                        createProxyMethod(msg.result, msg.resultName, method)
	                    })
	                    if(msg.resultName === 'index'){
	                        conf.onIndex(msg.result)
	                    }
	                    objects[msg.resultName] = msg.result
	                }
	                
	                if(response[msg.id] !== undefined){
	                    response[msg.id].resolve(msg.result)
	                    delete response[msg.id]
	                }
	            }
	            if (msg.type === 'object-broadcast') {
	                console.log('applying changes')
	                var object = objects[msg.name]
	                if(object){
	                    applyChanges(object, msg.changes)
	                } else {
	                    console.log('object not found '+msg.name)
	                }
	            }
	        }
	        if (conf.onmessage) {
	            conf.onmessage(apply)
	        } else {
	            apply()
	        }
	        
	    }
	    return client
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict'
	/*global PIXI */
	
	module.exports = function createBoard(spec){
	    const model = spec.model
	    const debug = spec.debug
	    const resources = spec.resources
	    const stage = spec.stage;
	
	    const board = new PIXI.Container()
	
	    board.position.x = 48
	    board.position.y = 48
	
	    model.board.data.forEach((el, i)=> {
	
	        const tile = new PIXI.Container()
	        tile.position.x = (i % model.board.width) * resources.floor.frameWidth
	        tile.position.y = Math.floor(i / model.board.width) * resources.floor.frameHeight
	
	        if(el.layers.floor !== ''){
	            const sp = el.layers.floor.split('_')
	            const floor = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
	            tile.addChild(floor)
	        }
	
	        if(el.layers.middle !== ''){
	            const sp = el.layers.middle.split('_')
	            const middle = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
	            tile.addChild(middle)
	        }
	
	        if(el.layers.ceiling !== ''){
	            const sp = el.layers.middle.split('_')
	            const ceiling = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
	            tile.addChild(ceiling)
	        }
	
	        if(debug === true && el.obstacle === true){
	            const debug = new PIXI.Sprite(resources.debug.frames[0])
	            tile.addChild(debug)
	        }
	
	        board.addChild(tile)
	    })
	
	    stage.addChild(board)
	
	    return {
	
	    }
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Created by odrin on 14.09.2015.
	 */
	"use strict";
	/*global PIXI */
	/*global EZGUI */
	
	module.exports = function createConsole(spec){
	    const renderer = spec.renderer
	    const stage = spec.stage
	    const numberOfLines = spec.numberOfLines || 11
	    const maxLineLength = spec.maxLineLength || 60
	
	    let inputListener = ()=>{}
	    const guiConsole = new PIXI.Container()
	    guiConsole.visible = false
	    const lines = []
	    const history = []
	    let historyPointer = 0
	
	    for(let i=numberOfLines;i>0;--i){
	        const line = new PIXI.Text('',{font : '20px Arial', fill : 0xffffff, align : 'center'});
	        line.position.x = 15
	        line.position.y = 10 + i*25
	        lines.push(line);
	        guiConsole.addChild(line)
	    }
	
	    var guiBtn = {
	        id: 'sendButton',
	        text: 'Send',
	        component: 'Button',
	        skin: 'bluebutton',
	        padding: 4,
	        position: { x: 535, y: 315 },
	        width: 90,
	        height: 30
	    }
	
	    const guiInput = {
	        id: 'commandInput',
	        text: '',
	        component: 'Input',
	        position: { x: 10, y: 315 },
	        width: 520,
	        height: 30
	    }
	
	    const commit = () => {
	        history.push(EZGUI.components.commandInput.text)
	        historyPointer = history.length
	        inputListener(EZGUI.components.commandInput.text)
	        EZGUI.components.commandInput.text = ""
	    }
	
	    EZGUI.renderer = renderer;
	    EZGUI.Theme.load(['/assets/ezgui/kenney-theme/kenney-theme.json'], function () {
	        var sendBtn = EZGUI.create(guiBtn, 'kenney')
	        var inputBtn = EZGUI.create(guiInput, 'kenney')
	        EZGUI.components.sendButton.on('click', function (event) {
	            commit()
	        })
	        guiConsole.addChild(sendBtn)
	        guiConsole.addChild(inputBtn)
	    })
	
	    stage.addChild(guiConsole)
	
	
	    window.onkeyup = function(e) {
	        var key = e.keyCode ? e.keyCode : e.which
	
	        if (key === 192 /* ` */) {
	            e.preventDefault()
	            guiConsole.visible = !guiConsole.visible
	            EZGUI.components.commandInput.text = ""
	        }
	        else if (key === 13/*enter*/ && guiConsole.visible) {
	            e.preventDefault()
	            commit()
	        }
	        else if(key === 38 /*up*/) {
	            historyPointer--
	            if(history.length !== 0 && historyPointer < history.length && historyPointer >= 0){
	                EZGUI.components.commandInput.text = history[historyPointer]
	            } else {
	                historyPointer++
	            }
	        }
	        else if(key === 40 /* down */){
	            historyPointer++
	            if(history.length !== 0 && historyPointer >= 0){
	                if(historyPointer < history.length){
	                    EZGUI.components.commandInput.text = history[historyPointer]
	                } else {
	                    EZGUI.components.commandInput.text = ''
	                    historyPointer = history.length
	                }
	            } else {
	                historyPointer--
	            }
	        }
	    }
	
	    const write = (text)=>{
	        for(let i=lines.length-1; i>0;--i){
	            lines[i].text = lines[i-1].text
	        }
	        lines[0].text = text
	    }
	
	    return {
	        writeLine(text){
	            const words = text.split(' ')
	            while(words.length !== 0){
	                let line = words.splice(0,1);
	                while(words.length !== 0 && line.length+words[0].length+1 < maxLineLength){
	                    line = line+' '+words.splice(0,1)
	                }
	                if(line > maxLineLength){
	                    const parts = line.slice(maxLineLength)
	                    line = parts[0]
	                    words.splice(0,0,line[1])
	                }
	                write(line)
	            }
	        },
	        setInputListener(il){
	            inputListener = il
	        },
	        show(){
	
	        },
	        hide(){
	
	        }
	    }
	}
	


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Created by odrin on 15.09.2015.
	 */
	'use strict'
	
	module.exports = function createInterpreter(spec){
	
	    const model = spec.model
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map