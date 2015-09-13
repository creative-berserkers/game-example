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
	
	document.addEventListener('DOMContentLoaded', function () {
	
	    const assets = {}
	    const init = (stage, resources) => {
	
	
	        const board = new PIXI.Container()
	        board.position.x = 48
	        board.position.y = 48
	
	        createNautilusClient({
	            host: 'ws://' + location.host,
	            onIndex: function (model) {
	                console.log('received index object')
	                console.log(model)
	
	                model.board.data.forEach((el, i)=> {
	
	                    const tile = new PIXI.Container()
	                    tile.anchor.x = 0.5
	                    tile.anchor.y = 0.5
	                    tile.position.x = (i % model.board.width) * resources.floor.frameWidth
	                    tile.position.y = Math.floor(i / model.board.width) * resources.floor.frameHeight
	
	                    if(el.data.layers.floor !== ''){
	                        const sp = el.data.layers.floor.split('_')
	                        const floor = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
	                        tile.addChild(floor)
	                    }
	
	                    if(el.data.layers.middle !== ''){
	                        const sp = el.data.layers.middle.split('_')
	                        const middle = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
	                        tile.addChild(middle)
	                    }
	
	                    if(el.data.layers.ceiling !== ''){
	                        const sp = el.data.layers.middle.split('_')
	                        const ceiling = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
	                        tile.addChild(ceiling)
	                    }
	
	                    board.addChild(tile)
	                })
	
	                stage.addChild(board)
	            }
	        })
	    }
	
	    const update = (delta)=> {
	        //assets.bunny.rotation += (delta/1000)
	    }
	
	    setup({
	        assets: [{
	            name: 'floor',
	            url: '/assets/img/Objects/Floor.png'
	        }],
	        init: init,
	        update: update,
	        viewport: {
	            width: 1920,
	            height: 1080
	        },
	        scale: 4
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
	            for (let y = 0; y < resource.texture.height - resource.frameHeight; y += resource.frameHeight) {
	                for (let x = 0; x < resource.texture.width - resource.frameWidth; x += resource.frameWidth) {
	                    resource.frames.push(new PIXI.Texture(resource.texture.baseTexture, new PIXI.Rectangle(x, y, resource.frameWidth, resource.frameHeight)));
	                }
	            }
	            next()
	        })
	        .load(function (loader, resources) {
	            initCb(stage, resources)
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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map