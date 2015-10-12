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
	
	const EventEmitter = __webpack_require__(1);
	const setupGame = __webpack_require__(2)
	const createKeyboardMappings = __webpack_require__(5)
	const createHyperionClient = __webpack_require__(6).createHyperionClient
	const createBoard = __webpack_require__(13)
	const createPlayer = __webpack_require__(14)
	const createTargetPointer = __webpack_require__(15)
	const createConsole = __webpack_require__(16)
	const createEditor = __webpack_require__(17)
	const createInterpreter = __webpack_require__(20)
	
	document.addEventListener('DOMContentLoaded', function () {
	
	    const debug = true
	    const init = (graphicsCtx) => {
	        let client = createHyperionClient({
	            host: 'ws://' + location.host
	        })
	
	        const emiter = new EventEmitter()
	
	        createKeyboardMappings({
	            emiter: emiter
	        })
	
	        client.then((clientCtx) => {
	            const board = createBoard({
	                clientCtx : clientCtx,
	                graphicsCtx : graphicsCtx,
	                emiter : emiter,
	                parent : graphicsCtx.stage
	            })
	
	            createTargetPointer({
	                clientCtx : clientCtx,
	                graphicsCtx : graphicsCtx,
	                emiter : emiter,
	                name : 'aPlayer',
	                parent : board.container()
	            })
	
	            createTargetPointer({
	                clientCtx : clientCtx,
	                graphicsCtx : graphicsCtx,
	                emiter : emiter,
	                name : 'bPlayer',
	                parent : board.container()
	            })
	
	            createPlayer({
	                clientCtx : clientCtx,
	                graphicsCtx : graphicsCtx,
	                emiter : emiter,
	                name : 'aPlayer',
	                parent : board.container()
	            })
	
	            createPlayer({
	                clientCtx : clientCtx,
	                graphicsCtx : graphicsCtx,
	                emiter : emiter,
	                name : 'bPlayer',
	                parent : board.container()
	            })
	
	            const guiConsole = createConsole({
	                graphicsCtx : graphicsCtx,
	                emiter : emiter
	            })
	
	            const interpreter = createInterpreter({
	                clientCtx: clientCtx
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
	
	            const editor = createEditor({
	                graphicsCtx : graphicsCtx,
	                clientCtx : clientCtx,
	                emiter : emiter
	            })
	        },(error)=>{
	            console.log(error)
	        })
	    }
	
	    const update = (delta)=> {
	        //assets.bunny.rotation += (delta/1000)
	    }
	
	    setupGame({
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
	            },
	            {
	                name: 'editor',
	                url: '/assets/img/Editor/EditorControls.png'
	            },
	            {
	                name: 'mage',
	                url: '/assets/img/Commissions/Mage.png'
	            },
	            {
	                name: 'walking',
	                url: '/assets/img/Other/Walking.png'
	            },
	            {
	                name: 'tile',
	                url: '/assets/img/Objects/Tile.png'
	            },
	            {
	                name: 'fogofwar',
	                url: '/assets/img/Other/FogOfWar.png'
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

	'use strict';
	
	//
	// We store our EE objects in a plain object whose properties are event names.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// `~` to make sure that the built-in object properties are not overridden or
	// used as an attack vector.
	// We also assume that `Object.create(null)` is available when the event name
	// is an ES6 Symbol.
	//
	var prefix = typeof Object.create !== 'function' ? '~' : false;
	
	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} once Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}
	
	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }
	
	/**
	 * Holds the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;
	
	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @param {Boolean} exists We only need to know if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events && this._events[evt];
	
	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];
	
	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }
	
	  return ee;
	};
	
	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return false;
	
	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;
	
	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
	
	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }
	
	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }
	
	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;
	
	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
	
	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }
	
	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }
	
	  return true;
	};
	
	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Functon} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Mixed} context Only remove listeners matching this context.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return this;
	
	  var listeners = this._events[evt]
	    , events = [];
	
	  if (fn) {
	    if (listeners.fn) {
	      if (
	           listeners.fn !== fn
	        || (once && !listeners.once)
	        || (context && listeners.context !== context)
	      ) {
	        events.push(listeners);
	      }
	    } else {
	      for (var i = 0, length = listeners.length; i < length; i++) {
	        if (
	             listeners[i].fn !== fn
	          || (once && !listeners[i].once)
	          || (context && listeners[i].context !== context)
	        ) {
	          events.push(listeners[i]);
	        }
	      }
	    }
	  }
	
	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[evt] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[evt];
	  }
	
	  return this;
	};
	
	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;
	
	  if (event) delete this._events[prefix ? prefix + event : event];
	  else this._events = prefix ? {} : Object.create(null);
	
	  return this;
	};
	
	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};
	
	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;
	
	//
	// Expose the module.
	//
	if (true) {
	  module.exports = EventEmitter;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	/*global PIXI */
	
	const createOnResizeHandler = __webpack_require__(3)
	const createGoFullscreenButton = __webpack_require__(4)
	
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
	    /*document.body.appendChild(createGoFullscreenButton({
	        canvas: renderer.view
	    }))*/
	
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
	            initCb({
	                stage : stage,
	                resources : resources,
	                renderer : renderer
	            })
	        });
	
	    let lastTime = Date.now()
	    let timeSinceLastFrame = 0
	
	    function animate() {
	        requestAnimationFrame(animate)
	        let now = Date.now()
	        timeSinceLastFrame = now - lastTime
	        updateCb(timeSinceLastFrame)
	        lastTime = now
	
	        renderer.render(stage)
	    }
	
	    requestAnimationFrame(animate)
	}


/***/ },
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	/**
	 * Created by odrin on 21.09.2015.
	 */
	'use strict'
	
	module.exports = function createKeyboardMappings(spec){
	    const emiter = spec.emiter
	
	    const keyboardMappings = [
	        {
	            keyboardCode : 49,
	            eventToEmit : 'r4two:action:editor'
	        },
	        {
	            keyboardCode : 192,
	            eventToEmit : 'r4two:action:console'
	        },
	        {
	            keyboardCode : 13,
	            eventToEmit : 'r4two:action:accept'
	        },
	        {
	            keyboardCode : 38,
	            eventToEmit : 'r4two:action:up'
	        },
	        {
	            keyboardCode : 40,
	            eventToEmit : 'r4two:action:down'
	        }
	    ]
	
	    window.onkeyup = function(e) {
	        const key = e.keyCode ? e.keyCode : e.which
	
	        keyboardMappings.forEach((el)=>{
	            if(el.keyboardCode === key){
	                emiter.emit(el.eventToEmit)
	            }
	        })
	    }
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const Multiobserve = __webpack_require__(7).Multiobserve
	const validateMessage = __webpack_require__(8).validateMessage
	const createObjectStore = __webpack_require__(9).createObjectStore
	const guid = __webpack_require__(10).guid
	
	exports.createHyperionClient = __webpack_require__(11)
	exports.hyperion = function(spec) {
	
	    if(spec.wss === undefined){
	        throw new Error('No socket found, please specify wss')
	    }
	    
	    function send(ws, object) {
	        ws.send(JSON.stringify(object))
	    }
	
	    const objectStore = createObjectStore((objRecord, changes) => {
	        const msg = JSON.stringify({
	            type: 'object-broadcast',
	            name: objRecord.name,
	            changes: changes
	        })
	        objRecord.bindings.forEach((ws) => {
	            ws.send(msg)
	        })
	    })
	    const newConnectionFn = spec.newConnectionFn
	    const errorFn = spec.errorFn
	    const wss = spec.wss
	    const model = spec.modelSpec.model
	    
	    objectStore.registerObject(model,0, 'index')
	
	    wss.on('connection', (ws) => {
	        if (typeof newConnectionFn === 'function') {
	            newConnectionFn(ws)
	        }
	
	        objectStore.bind(model, ws)
	
	        const name = guid()
	        const store = new Map()
	        const ctx = Object.freeze({
	            name,
	            emit: (adress, msg) => {
	                ws.send(ws, {
	                    type: 'message',
	                    adress: adress,
	                    message: msg
	                })
	            },
	            sync: (object) =>{
	                objectStore.bind(object, ws)
	            },
	            unsync: (object) => {
	                objectStore.unbind(object, ws)
	            },
	            onDisconnect: (callback)=>{
	                ws.on('close', function close() {
	                    callback()
	                })
	            },
	            disconnect: ()=>{
	                if(ws._socket !== null){
	                    ws._socket.server.close()
	                }
	            },
	            set :(key, value)=>{
	                return store.set(key, value)
	            },
	            get : (key) => {
	                return store.get(key)
	            },
	            has : (key) =>{
	                return store.has(key)
	            }
	        })
	
	        ws.on('message', (message) => {
	            try {
	                const validMessage = validateMessage(JSON.parse(message))
	                if (validMessage.type === 'object-call') {
	                    handleObjectCall(ws, ctx, validMessage)
	                }
	            }
	            catch (e) {
	                console.log(e)
	            }
	        })
	
	        ws.on('close', function close() {
	            spec.modelSpec.onLeave(ctx)
	            objectStore.allBindObjects(ws).forEach((ob) => {
	                objectStore.unbind(ob, ws)
	            })
	        })
	        spec.modelSpec.onJoin(ctx)
	        handleMethodResult(ws, 'index' , -1, model)
	    })
	
	
	    function handleObjectCall(ws,ctx, msg) {
	        const obj= objectStore.lookupByName(msg.name)
	        if (obj === undefined) {
	            return
	        }
	
	        const node = Multiobserve.findNode(obj, msg.path)
	
	        if (node !== undefined && typeof node === 'function') {
	            const result = node.apply(obj, [ctx].concat(msg.args))
	            if (result instanceof Promise) {
	                result.then(function(result) {
	                    handleMethodResult(ws, msg.name, msg.id, result)
	                })
	            }
	            else {
	                handleMethodResult(ws, msg.name, msg.id, result)
	            }
	        }
	    }
	
	    function handleMethodResult(ws, name, id, result) {
	        const objectRecord = objectStore.lookupByObject(result)
	        if (objectRecord !== undefined) {
	            send(ws, {
	                type: 'call-response',
	                name: name,
	                id: id,
	                synced: true,
	                methods: objectRecord.methods,
	                result: objectRecord.object,
	                resultName: objectRecord.name
	            })
	        } else {
	            send(ws, {
	                type: 'call-response',
	                name: name,
	                id: id,
	                synced: false,
	                result: result
	            })
	        }
	    }
	
	    return Object.freeze({
	        syncObject(object, lifetime){
	            return objectStore.registerObject(object, lifetime)
	        },
	        unsyncObject(object){
	            return objectStore.unregisterObject(object)
	        }
	    })
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict'
	
	const objects = new WeakMap()
	
	function typeOf(value) {
	    let s = typeof value;
	    if (s === 'object') {
	        if (value) {
	            if (value instanceof Array) {
	                s = 'array'
	            }
	        }
	        else {
	            s = 'null';
	        }
	    }
	    return s;
	}
	
	function observeObject(ctx, object, path) {
	    let func = function (changes) {
	        changes.forEach(function(change) {
	            ctx.notify({
	                path: path.concat(change.name),
	                node: change.object,
	                type: change.type,
	                name: change.name,
	                oldValue: change.oldValue
	            })
	            if(change.type === 'add'){
	                if(!ctx.filter(object,path)) { return }
	                observeDeepObject(ctx, change.object, path)
	            } else if(change.type === 'delete') {
	                unobserveDeepObject(ctx, change.oldValue, path.concat(change.name))
	            }
	        })
	    }
	    ctx.setHandler(object, path, func)
	    Object.observe(object, func)
	}
	
	function observeArray(ctx, object, name, path) {
	    Array.observe(object, function(changes) {
	        changes.forEach(function(change) {
	            let msg = null
	            
	            if(change.type === 'update'){
	                msg = {
	                    path: path.concat(change.name),
	                    node: change.object,
	                    type: 'update',
	                    name: change.name,
	                    oldValue: change.oldValue
	                }
	            } else if (change.type === 'splice'){
	                msg = {
	                    path: path,
	                    node: change.object,
	                    type: 'update',
	                    arrayChangeType: change.type,
	                    name: name,
	                    index: change.index,
	                    removed: change.removed,
	                    //added: change.object.slice(change.index,change.addedCount),
	                    addedCount: change.addedCount,
	                    oldValue: change.oldValue
	                }
	                
	                let added = change.object.slice(change.index,change.index+change.addedCount);
	                
	                added.forEach(function(element){
	                    if(typeOf(element) !== 'array' && typeOf(element) !== 'object' && typeOf(element) !== 'function') { return }
	                    if(!ctx.filter(element,path.concat(String(change.index)))) { return }
	                    observeObject(ctx,element,path.concat(String(change.index)))
	                    observeDeepObject(ctx,element,path.concat(String(change.index)))
	                })
	                change.removed.forEach(function(element){
	                    if(typeOf(element) === 'array'){
	                        Array.unobserve(element, ctx.getHandler(element,path.concat(String(change.index))))
	                        unobserveDeepArray(ctx, element, change.path)
	                    } else if (typeOf(element) === 'object' || typeOf(element) === 'function') {
	                        Object.unobserve(element, ctx.getHandler(element,path.concat(String(change.index))))
	                        unobserveDeepObject(ctx, element, change.path)
	                    }
	                    
	                })
	            }
	            
	            ctx.notify(msg)
	        })
	    })
	}
	
	function unobserveDeepObject(ctx, object, path) {
	    Object.keys(object).forEach(function(property){
	        let propObject = object[property]
	
	        if (typeOf(propObject) === 'object') {
	            Object.unobserve(propObject, ctx.getHandler(propObject, path.concat(property)))
	            unobserveDeepObject( ctx, propObject, path.concat(property))
	        } else if(typeOf(propObject) === 'array'){
	            Array.unobserve(propObject, ctx.getHandler(propObject,path.concat(property)))
	            unobserveDeepArray(ctx, propObject, path.concat(property))
	        }
	    })
	}
	
	function unobserveDeepArray(ctx, array, path) {
	    array.forEach(function(element, index){
	
	        if (typeOf(element) === 'object' || typeOf(element) === 'function') {
	            Object.unobserve(element, ctx.getHandler(element, path.concat(String(index))))
	            unobserveDeepObject( ctx, element, path.concat(String(index)))
	        } else if(typeOf(element) === 'array'){
	            Array.unobserve(element, ctx.getHandler(element,path.concat(String(index))))
	            unobserveDeepArray(ctx, array, path.concat(String(index)))
	        }
	    })
	}
	
	function observeDeepObject(ctx, object, path) {
	    Object.keys(object).forEach(function(property){
	        const currPath = path.concat([property])
	        const propObject = object[property]
	
	        if (typeOf(propObject) === 'object' || typeOf(propObject) === 'function') {
	            if(!ctx.filter(propObject,currPath)) { return }
	            observeObject(ctx, propObject, currPath)
	            observeDeepObject(ctx, propObject, currPath)
	        } else if(typeOf(propObject) === 'array'){
	            if(!ctx.filter(propObject,currPath)) { return }
	            observeArray(ctx,propObject,property,currPath)
	            observeDeepArray(ctx, propObject, currPath)
	        }
	    })
	}
	
	function observeDeepArray(ctx, array, path) {
	    array.forEach(function(element, index) {
	        const currPath = path.concat(String(index))
	
	        if(typeOf(element) === 'array') {
	            if(!ctx.filter(element,currPath)) { return }
	            observeArray(ctx,element,currPath)
	            observeDeepArray(ctx, element, currPath)
	        } else if(typeOf(element) === 'object' || typeOf(element) === 'function') {
	            if(!ctx.filter(element,currPath)) { return }
	            observeObject(ctx,element,currPath)
	            observeDeepObject(ctx, element, currPath)
	        }
	    })
	}
	
	function comparePaths(path1, path2){
	    return (path1.length === path2.length) && path1.every(function(element, index) {
	        return element === path2[index];
	    })
	}
	
	function findAndAddMethod(object, path, methods){
	    Object.getOwnPropertyNames(object).forEach(function(prop){
	        if(typeOf(object[prop]) === 'function'){
	            methods.push(path.concat(prop))
	        }
	        if(typeOf(object[prop]) === 'object'){
	            findAndAddMethod(object[prop],path.concat(prop), methods)
	        }
	        if(typeOf(object[prop]) === 'array'){
	            object[prop].forEach(function(el, index){
	                findAndAddMethod(el,path.concat(prop).concat(String(index)), methods)
	            })
	        }
	    })
	}
	
	exports.Multiobserve = {
	    observe(object, callback, filterCallback){
	        const root = {}
	        const rootNotifier = Object.getNotifier(root)
	        const handlers = new WeakMap()
	        const ctx = Object.freeze({
	            notify(msg) {
	                rootNotifier.notify(msg)
	            },
	            setHandler(object, path, handler ) {
	                let ph = handlers.get(object)
	                let o = {
	                    handler,
	                    path
	                }
	                if(ph === undefined){
	                    ph = [o]
	                    handlers.set(object, ph)
	                } else {
	                    if(!ph.some(function(el){
	                        return comparePaths(el.path, path)
	                    })){
	                        ph.push(o)
	                    }
	                }
	
	            },
	            getHandler(object, path){
	                let ph = handlers.get(object)
	                let result = void(0)
	                ph.forEach(function(el){
	                    if(comparePaths(el.path, path)){
	                        result = el.handler
	                    }
	                })
	                return result
	            },
	            filter(node, path){
	                return filterCallback === undefined ? true : filterCallback(node, path)
	            }
	        })
	        observeObject(ctx, object, [])
	        observeDeepObject(ctx, object, [])
	        Object.observe(root,function(changes){
	            callback(changes.map(function(change){
	                if(change.arrayChangeType === 'splice'){
	                    return {
	                        node : change.node || object,
	                        path : change.path || change.name,
	                        type : 'splice',
	                        index: change.index,
	                        removed: change.removed,
	                        addedCount: change.addedCount
	                    }
	                } else if(change.type === 'update' || change.type === 'add' || change.type === 'delete'){
	                    return {
	                        node : change.node || object,
	                        path : change.path || change.name,
	                        type : change.type,
	                        oldValue : change.oldValue
	                    }
	                }
	                return {}
	            }))
	        })
	        objects.set(object, {
	            root,
	            rootNotifier,
	            handlers,
	            ctx
	        })
	        return {
	            performChange(name, changeFn){
	                rootNotifier.notify({
	                    name : name,
	                    type : 'update',
	                    batchChangeType : 'begin'
	                })
	                const resultMsg = changeFn()
	                rootNotifier.notify({
	                    name : name,
	                    type : 'update',
	                    batchChangeType : 'end',
	                    resultMsg : resultMsg
	                })
	            }
	        }
	    },
	    findNode(object, path){
	        if(!Array.isArray(path)) {
	            return undefined
	        }
	        let curr = object
	        path.every(function(node) {
	            if (curr[node] !== undefined) {
	                curr = curr[node]
	                return true
	            } else {
	                curr = undefined
	                return false
	            }
	        })
	        return curr
	    },
	    methodsToPaths(object){
	        const methods = []
	        
	        findAndAddMethod(object, [], methods)
	        return methods
	    }
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	exports.validateMessage = (msg) =>{
	
	    if (!msg.hasOwnProperty('type')) {
	        throw new Error('Missing type property.')
	    }
	    if (msg.type !== 'object-get' && msg.type !== 'object-call') {
	        throw new Error('Type must be one of [object-get,object-call].')
	    }
	    
	    if(msg.type === 'object-get'){
	    
	        if (!msg.hasOwnProperty('name')) {
	            throw new Error('Missing name property.')
	        }
	        
	    } else if(msg.type === 'object-call'){
	        if (!msg.hasOwnProperty('name')) {
	            throw new Error('Missing name property.')
	        }
	        if (!msg.hasOwnProperty('path')) {
	            throw new Error('Missing path property.')
	        }
	        if (!Array.isArray(msg.path)) {
	            throw new Error('Property path is not an array.')
	        }
	        if (!msg.hasOwnProperty('args')) {
	            throw new Error('Missing args property.')
	        }
	        if (!Array.isArray(msg.args)) {
	            throw new Error('Property args is not an array.')
	        }
	        if (!msg.hasOwnProperty('id')) {
	            throw new Error('Missing id property.')
	        }
	    }
	    
	    return msg
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const Multiobserve = __webpack_require__(7).Multiobserve
	const guid = __webpack_require__(10).guid
	
	exports.createObjectStore = function (transformer) {
	    
	    const objectToRecord = new Map()
	    const nameToRecord = new Map()
	    const targetToObjects = new Map()
	    
	    const trfm = transformer || (()=>{})
	    
	    let statObject
	    
	    const self = Object.freeze({
	        registerObject(obj, lifetime, name){
	            let objRecord = objectToRecord.get(obj)
	            if(objRecord === undefined){
	                objRecord = Object.freeze({
	                    name : (name || guid()),
	                    bindings : new Set(),
	                    object : obj,
	                    methods : [],
	                    lifetime : (lifetime || 0),
	                    timerHandle : -1
	                })
	                objectToRecord.set(obj, objRecord)
	                nameToRecord.set(objRecord.name, objRecord)
	                
	                Multiobserve.observe(obj,(changes) => {
	                    trfm(objRecord, changes)
	                },
	                (node, path) => {
	                    if(typeof node === 'function'){
	                        objRecord.methods.push(path)
	                    }
	                    return true
	                })
	                if(statObject !== undefined){
	                    statObject.objects++
	                }
	            } 
	            return objRecord
	        },
	        unregisterObject(obj){
	            const objRecord = objectToRecord.get(obj)
	            if(objRecord !== undefined){
	                Multiobserve.unobserve(objRecord.object)
	                objectToRecord.delete(objRecord)
	                nameToRecord.delete(objRecord)
	                if(statObject !== undefined){
	                    statObject.objects--
	                }
	            }
	        },
	        bind(object, target){
	            let objRecord = objectToRecord.get(object)
	            if(objRecord === undefined){
	                objRecord = self.registerObject(object)
	            }
	            
	            objRecord.bindings.add(target)
	            const objects = targetToObjects.get(target)
	            if(objects === undefined){
	                targetToObjects.set(target, new Set([objRecord.object]))
	                if(statObject !== undefined){
	                    statObject.targets++
	                }
	            } else {
	                objects.add(objRecord.object)
	            }
	            if(objRecord.timerHandle !== -1){
	                clearTimeout(objRecord.timerHandle)
	                objRecord.timerHandle = -1
	            }
	            
	            return objRecord
	        },
	        unbind(object, target){
	            const objRecord = objectToRecord.get(object)
	            if(objRecord !== undefined){
	                objRecord.bindings.delete(target)
	                const objects = targetToObjects.get(target)
	                if(objects !== undefined){
	                    objects.delete(objRecord.object)
	                    if(objects.size === 0 && statObject !== undefined){
	                        statObject.targets--
	                    }
	                }
	                if(objRecord.bindings.size === 0 && objRecord.lifetime !== 0){
	                    if(objRecord.timerHandle !== -1) {
	                        clearTimeout(objRecord.timerHandle)
	                    }
	                    objRecord.timerHandle = setTimeout(()=>{
	                        self.unregisterObject(objRecord.object)
	                        objRecord.timerHandle = -1
	                    }, objRecord.lifetime)
	                }
	            }
	            return objRecord
	        },
	        lookupByName(name){
	            const objRecord = nameToRecord.get(name)
	            if(objRecord !== undefined){
	                return objRecord.object
	            }
	            return undefined
	        },
	        lookupByObject(object){
	            const objRecord = objectToRecord.get(object)
	            if(objRecord !== undefined){
	                return objRecord
	            }
	            return undefined
	        },
	        allBindObjects(target){
	            return targetToObjects.get(target)
	        },
	        getStatObject(){
	            if(statObject === undefined){
	                statObject = Object.freeze({
	                    objects : Number(objectToRecord.size),
	                    targets : Number(targetToObjects.size)
	                })
	                self.registerObject(statObject)
	            }
	            return statObject
	        }
	    })
	    
	    return self
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	exports.guid = function guid() {
	    function s4() {
	        return Math.floor((1 + Math.random()) * 0x10000)
	            .toString(16)
	            .substring(1);
	    }
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	        s4() + '-' + s4() + s4() + s4();
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const createChangeHandler = __webpack_require__(12)
	
	module.exports = function createHyperionClient(spec) {
	    const socket = spec.socket || new WebSocket(spec.host)
	    const response = Object.create(null,{})
	    const objects = Object.create(null,{})
	    const changeHandler = createChangeHandler()
	    let id = 0
	    let messageLock = false
	    let messages = []
	
	    function send(msg){
	        console.log('=>')
	        console.log(msg)
	        socket.send(JSON.stringify(msg))
	    }
	
	    function createProxyMethod(object, objectName, method) {
	        let curr = object
	        method.forEach(function(node) {
	            if (curr[node] === undefined) {
	                curr[node] = function() {
	                    const currId = id++
	
	                    const promise = new Promise(function(resolve, reject) {
	                        response[currId] = {
	                            resolve: resolve,
	                            reject: reject
	                        }
	                    })
	                    const msg = {
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
	
	    function applyChange(object, change, next){
	        if(change.type === 'update'){
	            let curr = object
	            change.path.forEach(function(node){
	                if(change.path[change.path.length-1] === node){
	                    curr[node] = change.node[change.path[change.path.length -1]]
	                }
	                curr = curr[node]
	            })
	            changeHandler.fireOnChangeEvent({
	                path: change.path,
	                newValue : change.node[change.path[change.path.length -1]],
	                oldValue : change.oldValue,
	                next : next
	            })
	        } else if(change.type === 'splice'){
	            let curr = object
	            change.path.forEach(function(node){
	                if(change.path[change.path.length-1] === node){
	                    curr[node].splice.apply(curr[node],[change.index,change.removedCount].concat(change.added))
	                }
	                curr = curr[node]
	            })
	            next()
	        }
	    }
	
	    function applyChanges(object, changes, next){
	        let nextCb
	        let entries = changes.entries()
	        nextCb = ()=>{
	            let entry = entries.next()
	            if(entry.done) {
	                return next()
	            } else {
	                return applyChange(object, entry.value[1], nextCb)
	            }
	        }
	        nextCb()
	    }
	
	    const clientCtx = {
	        model: {},
	        createChangeListener : changeHandler.registerHandler
	    }
	
	    return new Promise(function(resolve, reject) {
	
	        function process(){
	            if(messageLock === true) {
	                return
	            }
	            if(messages.length >= 1){
	                messageLock = true
	                apply(messages.shift())
	            }
	        }
	
	        function apply(data) {
	            let msg = JSON.parse(data)
	            console.log('<=')
	            console.log(msg)
	            if (msg.type === 'call-response') {
	                if(msg.synced === true && objects[msg.resultName] === undefined){
	                    msg.methods.forEach(function(method) {
	                        createProxyMethod(msg.result, msg.resultName, method)
	                    })
	                    if(msg.resultName === 'index'){
	                        clientCtx.model = msg.result
	                        resolve(clientCtx)
	                    }
	                    objects[msg.resultName] = msg.result
	                }
	
	                if(response[msg.id] !== undefined){
	                    response[msg.id].resolve(msg.result)
	                    delete response[msg.id]
	                }
	                messageLock = false
	                setTimeout(process,0)
	            } else if (msg.type === 'object-broadcast') {
	                console.log('applying changes')
	                const object = objects[msg.name]
	                if(object){
	                    applyChanges(object, msg.changes, ()=>{
	                        messageLock = false
	                        setTimeout(process,0)
	                    })
	                } else {
	                    console.log('object not found '+msg.name)
	                    messageLock = false
	                    setTimeout(process,0)
	                }
	            } else {
	                messageLock = false
	                setTimeout(process,0)
	            }
	        }
	
	        socket.onopen = function() {
	            if (spec.onopen) {
	                spec.onopen(clientCtx)
	            }
	        }
	
	        socket.onmessage = function(event) {
	            messages.push(event.data)
	            if(messages.length === 1){
	                setTimeout(process,0)
	            }
	        }
	
	        socket.onerror = function(event){
	            if(clientCtx.model === undefined){
	                reject(event)
	            }
	        }
	    })
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Created by odrin on 18.09.2015.
	 */
	'use strict'
	
	module.exports = function createChangeHandler(){
	
	    const listeners = {}
	    const onChangeId = Symbol()
	
	    function findParentForPath(path, index, parent) {
	        if(index === path.length - 1){
	            return parent
	        } else {
	            if(parent[path[index]] === undefined){
	                parent[path[index]] = {}
	            }
	            return findParentForPath(path, index + 1, parent[path[index]])
	        }
	    }
	
	    return {
	        registerHandler(spec){
	            const path = spec.path
	            const onChange = spec.onChange
	
	            if(path.length === 0 || onChange === undefined){
	                return
	            }
	
	            const parent = findParentForPath(path, 0, listeners)
	            if(parent[path[path.length-1]] === undefined){
	                parent[path[path.length-1]] = {}
	            }
	            if(parent[path[path.length-1]][onChangeId] === undefined){
	                parent[path[path.length-1]][onChangeId] = []
	            }
	            parent[path[path.length-1]][onChangeId].push(onChange)
	        },
	        fireOnChangeEvent(spec){
	            const path = spec.path
	            const oldValue = spec.oldValue
	            const newValue = spec.newValue
	            const next = spec.next
	
	            if(path.length === 0 || oldValue === undefined || newValue === undefined){
	                next()
	                return
	            }
	
	            const parent = findParentForPath(path, 0 , listeners)
	            if(parent[path[path.length-1]] === undefined){
	                next()
	                return
	            }
	            if(parent[path[path.length-1]][onChangeId] === undefined){
	                next()
	                return
	            }
	            const entrIter = parent[path[path.length-1]][onChangeId].entries()
	
	            let nextCb
	
	            nextCb = ()=>{
	                let entry = entrIter.next()
	                if(entry.done) {
	                    return next()
	                } else {
	                    return entry.value[1](path, oldValue, newValue, nextCb)
	                }
	            }
	            nextCb()
	        }
	
	    }
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict'
	/*global PIXI */
	
	module.exports = function createBoard(spec){
	    const clientCtx = spec.clientCtx
	    const graphicsCtx = spec.graphicsCtx
	    const emiter = spec.emiter
	    const parent = spec.parent
	
	    const model = clientCtx.model
	
	    const resources = graphicsCtx.resources
	
	    const debug = false
	    const board = new PIXI.Container()
	
	    board.position.x = 48
	    board.position.y = 48
	    board.hitArea = new PIXI.Rectangle(0, 0, model.board.width*resources.floor.frameWidth, model.board.height*resources.floor.frameWidth);
	    board.interactive = true
	    board.buttonMode = true
	
	    let disableInput = false
	    board.on('mousedown', (mouseData)=>{
	        const pos = mouseData.data.getLocalPosition(board)
	        const x = Math.floor(pos.x  / resources.floor.frameWidth)
	        const y = Math.floor(pos.y / resources.floor.frameWidth)
	        const tile = model.board.data[y*model.board.width+x]
	        if(tile.visibility === 'visible'){
	            emiter.emit('r4two:board:tileselect',{
	                position : {
	                    x : x,
	                    y : y,
	                },
	                obstacle : tile.obstacle
	            })
	            if(disableInput === true){
	                return
	            }
	            model.setTargetTo(x, y)
	        }
	    })
	
	    emiter.on('r4two:editor:visible', (flag)=>{
	        disableInput = flag
	    })
	
	    const createTileLayer = (data, name, tile, i) => {
	        if(data === ''){
	            data = 'wall_5'
	        }
	        const sp = data.split('_')
	        const ceiling = new PIXI.Sprite(resources[sp[0]].frames[sp[1]])
	
	        clientCtx.createChangeListener({
	            path:['board','data',i.toString(),'layers',name],
	            onChange : (path, oldValue, newValue, next)=>{
	                if(newValue === ''){
	                    newValue = 'wall_5'
	                }
	                const sp = newValue.split('_')
	                ceiling.texture = resources[sp[0]].frames[sp[1]]
	                next()
	            }
	        })
	
	        tile.addChild(ceiling)
	    }
	
		const createTileFogOfWar = (tile, tileSprite, i)=>{
			const fogofwar = new PIXI.Sprite(resources.fogofwar.frames[0])
			fogofwar.alpha = 0.5
			if(tile.visibility === 'discovered'){
				fogofwar.visible = true
			} else {
				fogofwar.visible = false
			}
			clientCtx.createChangeListener({
				path:['board','data',i.toString(),'visibility'],
				onChange : (path, oldValue, newValue, next)=>{
					if(newValue === 'discovered'){
						fogofwar.visible = true
					} else {
						fogofwar.visible = false
					}
					next()
				}
			})
			tileSprite.addChild(fogofwar)
		}
	
	    model.board.data.forEach((el, i)=> {
	
	        const tile = new PIXI.Container()
	        tile.position.x = (i % model.board.width) * resources.floor.frameWidth
	        tile.position.y = Math.floor(i / model.board.width) * resources.floor.frameHeight
	
	        createTileLayer(el.layers.floor, 'floor', tile, i)
	        createTileLayer(el.layers.middle, 'middle', tile, i)
	        createTileLayer(el.layers.ceiling, 'ceiling', tile, i)
	
	        createTileFogOfWar(el, tile, i)
	
	        if(debug === true){
	            const texObst = resources.debug.frames[0]
	            const texNonObst = resources.wall.frames[5]
	
	            const debug = new PIXI.Sprite(texNonObst)
	            clientCtx.createChangeListener({
	                path:['board','data',i.toString(),'obstacle'],
	                onChange : (path, oldValue, newValue, next)=>{
	                    debug.texture = newValue ? texObst : texNonObst
	                    next()
	                }
	            })
	            emiter.on('r4two:editor:show-obstacles', (flag)=>{
	                if(flag === true){
	                    debug.texture = el.obstacle ? texObst : texNonObst
	                } else {
	                    debug.texture = texNonObst
	                }
	            })
	            tile.addChild(debug)
	        }
	
	        board.addChild(tile)
	    })
	
	    parent.addChild(board)
	
	    return {
	        container : ()=>{
	            return board
	        }
	    }
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Created by odrin on 23.09.2015.
	 */
	'use strict'
	/*global PIXI */
	
	module.exports = function createPlayer(spec){
	    const clientCtx = spec.clientCtx
	    const graphicsCtx = spec.graphicsCtx
	    const emiter = spec.emiter
	    const name = spec.name
	    const parent = spec.parent
	
	    const stage = graphicsCtx.stage
	    const model = clientCtx.model
	    const resources = graphicsCtx.resources
	    const player = model.players[name]
	    const frames = resources[player.className].frames
	    const frameWidth = resources[player.className].frameWidth
	
	    const playerContainer = new PIXI.Container()
	    playerContainer.position.x = Number(player.position.x) * frameWidth
	    playerContainer.position.y = Number(player.position.y) * frameWidth
	
	
	    const directions = {
	        up : Symbol(),
	        down : Symbol(),
	        left : Symbol(),
	        right : Symbol(),
	        iddle : Symbol()
	    }
	
	    clientCtx.createChangeListener({
	        path:['players',name, 'position'],
	        onChange : (path, oldValue, newValue, next)=>{
	            playerContainer.position.x = Number(newValue.x) * frameWidth
	            playerContainer.position.y = Number(newValue.y) * frameWidth
	            next()
	        }
	    })
	
	
	    let createAnimation = (frames, visible)=>{
	        let animation = new PIXI.extras.MovieClip(frames)
	        animation.visible = visible
	        animation.animationSpeed = 0.1
	        animation.gotoAndPlay(0)
	        playerContainer.addChild(animation)
	    }
	
	    let animations = {}
	    animations[directions.down] = createAnimation([frames[0], frames[1], frames[2], frames[3]], true)
	    animations[directions.left] = createAnimation([frames[4], frames[5], frames[6], frames[7]], false)
	    animations[directions.right] = createAnimation([frames[8], frames[9], frames[10], frames[11]], false)
	    animations[directions.up] = createAnimation([frames[12], frames[13], frames[14], frames[15]], false)
	
	    parent.addChild(playerContainer)
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * Created by odrin on 23.09.2015.
	 */
	'use strict'
	/*global PIXI */
	
	module.exports = function createTargetPointer(spec){
	    const clientCtx = spec.clientCtx
	    const graphicsCtx = spec.graphicsCtx
	    const emiter = spec.emiter
	    const name = spec.name
	    const parent = spec.parent
	
	    const resources = graphicsCtx.resources
	    const model = clientCtx.model
	    const player = model.players[name]
	    const frameWidth = resources[player.className].frameWidth
	
	    const pathContainer = new PIXI.Container()
	    parent.addChild(pathContainer)
	    const pathWithSteps = []
	
	    const selectTexture = (previous, current, next)=>{
	        if(previous === undefined){
	            if(current.y === next.y){
	                if(current.x < next.x){
	                    return resources.walking.frames[11]
	                } else {
	                    return resources.walking.frames[8]
	                }
	            }
	            if(current.x === next.x){
	                if(current.y < next.y){
	                    return resources.walking.frames[10]
	                } else {
	                    return resources.walking.frames[5]
	                }
	            }
	        }
	        if(next === undefined){
	            if(current.y === previous.y){
	                if(current.x < previous.x){
	                    return resources.walking.frames[11]
	                } else {
	                    return resources.walking.frames[8]
	                }
	            }
	            if(current.x === previous.x){
	                if(current.y < previous.y){
	                    return resources.walking.frames[10]
	                } else {
	                    return resources.walking.frames[5]
	                }
	            }
	        }
	        if(previous.x === next.x){
	            return resources.walking.frames[12]
	        }
	        if(previous.y === next.y){
	            return resources.walking.frames[2]
	        }
	        if(previous.y - next.y === -1 && previous.x - next.x === -1){
	            if(previous.y === current.y){
	                return resources.walking.frames[6]
	            } else {
	                return resources.walking.frames[3]
	            }
	
	        }
	        if(previous.y - next.y === 1 && previous.x - next.x === 1){
	            if(previous.y === current.y){
	                return resources.walking.frames[3]
	            } else {
	                return resources.walking.frames[6]
	            }
	        }
	        if(previous.y - next.y === 1 && previous.x - next.x === -1){
	            if(previous.y === current.y){
	                return resources.walking.frames[7]
	            } else {
	                return resources.walking.frames[9]
	            }
	        }
	        if(previous.y - next.y === -1 && previous.x - next.x === 1){
	            if(previous.y === current.y){
	                return resources.walking.frames[9]
	            } else {
	                return resources.walking.frames[7]
	            }
	        }
	        return resources.walking.frames[2]
	    }
	
	    const updatePath = (path)=>{
	        while(pathWithSteps.length < path.length){
	            let pathStep = new PIXI.Sprite(resources.walking.frames[2])
	            pathWithSteps.push(pathStep)
	            pathContainer.addChild(pathStep)
	        }
	        path.forEach((step, i)=>{
	            let pathStep = pathWithSteps[i]
	            pathStep.position.x = step.x * frameWidth
	            pathStep.position.y = step.y * frameWidth
	            pathStep.texture = selectTexture(path[i-1], path[i], path[i+1])
	            pathStep.visible = true
	        })
	        for( let i = path.length; i < pathWithSteps.length ; ++i){
	            pathWithSteps[i].visible = false
	        }
	    }
	    clientCtx.createChangeListener({
	        path:['players',name,'target', 'path'],
	        onChange : (path, oldValue, newValue, next)=>{
	            updatePath(newValue)
	            next()
	        }
	    })
	
	    let disableInput = false
	
	    let targetId = name === 'aPlayer' ? 0 : 1
	    const targetPointer = new PIXI.Sprite(resources.walking.frames[targetId])
	    targetPointer.position.x = player.target.position.x * frameWidth
	    targetPointer.position.y = player.target.position.y * frameWidth
	    parent.addChild(targetPointer)
	
	    clientCtx.createChangeListener({
	        path:['players',name,'target', 'position'],
	        onChange : (path, oldValue, newValue, next)=>{
	            targetPointer.position.x = Number(newValue.x) * frameWidth
	            targetPointer.position.y = Number(newValue.y) * frameWidth
	            next()
	        }
	    })
	}

/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Created by odrin on 14.09.2015.
	 */
	'use strict'
	/*global PIXI */
	/*global EZGUI */
	
	module.exports = function createConsole(spec){
	    const graphicsCtx = spec.graphicsCtx
	    const emiter = spec.emiter
	    const renderer = graphicsCtx.renderer
	    const stage = graphicsCtx.stage
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
	
	    const guiBtn = {
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
	        EZGUI.components.commandInput.text = ''
	    }
	
	    EZGUI.renderer = renderer;
	    EZGUI.Theme.load(['/assets/ezgui/kenney-theme/kenney-theme.json'], function () {
	        const sendBtn = EZGUI.create(guiBtn, 'kenney')
	        const inputBtn = EZGUI.create(guiInput, 'kenney')
	        EZGUI.components.sendButton.on('click', function (event) {
	            commit()
	        })
	        guiConsole.addChild(sendBtn)
	        guiConsole.addChild(inputBtn)
	    })
	
	    stage.addChild(guiConsole)
	
	
	    emiter.on('r4two:action:console',()=>{
	        guiConsole.visible = !guiConsole.visible
	        EZGUI.components.commandInput.text = ''
	    })
	
	    emiter.on('r4two:action:accept',()=>{
	        commit()
	    })
	
	    emiter.on('r4two:action:up',()=>{
	        historyPointer--
	        if(history.length !== 0 && historyPointer < history.length && historyPointer >= 0){
	            EZGUI.components.commandInput.text = history[historyPointer]
	        } else {
	            historyPointer++
	        }
	    })
	
	    emiter.on('r4two:action:down',()=>{
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
	    })
	
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by odrin on 21.09.2015.
	 */
	'use strict'
	/*global PIXI */
	
	const createEditorIcon = __webpack_require__(18)
	const createTileSetPalette = __webpack_require__(19)
	
	module.exports = function createEditor(spec){
	    const graphicsCtx = spec.graphicsCtx
	    const clientCtx = spec.clientCtx
	    const emiter = spec.emiter
	    const renderer = graphicsCtx.renderer
	    const resources = graphicsCtx.resources
	    const stage = graphicsCtx.stage
	    let selectedEditor
	    let selectedLayerEditor
	    let currentSet = 0
	    let sets = Object.getOwnPropertyNames(resources)
	
	    const editorContainer = new PIXI.Container()
	    editorContainer.position.x = 30
	    editorContainer.position.y = 10
	    editorContainer.visible = false
	    stage.addChild(editorContainer)
	
	    let newBoardButton
	    let saveBoardButton
	    let reloadBoardButton
	
	    let tileEditor
	    let obstacleEditor
	
	    let floorLayerButton
	    let middleLayerButton
	    let ceilingLayerButton
	
	    let tileSetUpButton
	    let tileSetDownButton
	
	    let tileSetPalette
	    let currentMarker
	    let currentTexId = 0
	
	    let clearTileEditor
	
	    const tileSetLabel = new PIXI.Text(`${sets[currentSet]} (${resources[sets[currentSet]].texture.width/16} x ${resources[sets[currentSet]].texture.height/16})`,
	        {font : '16px Arial', fill : 0xffffff, align : 'center'});
	    tileSetLabel.position.x = 226
	    tileSetLabel.position.y = 0
	    editorContainer.addChild(tileSetLabel)
	
	    const notificationLabel = new PIXI.Text('',{font : '16px Arial', fill : 0xffffff, align : 'center'});
	    notificationLabel.position.x = 10
	    notificationLabel.position.y = 330
	    notificationLabel.visible = false
	    editorContainer.addChild(notificationLabel)
	
	    const showNotification = (text)=>{
	        notificationLabel.text = text
	        notificationLabel.visible = true
	        setTimeout(()=>{
	            notificationLabel.text = ''
	            notificationLabel.visible = false
	        }, 2000)
	    }
	
	    tileSetUpButton = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: false,
	        frame: 8,
	        position : {
	            x : 190,
	            y : 0
	        },
	        onClick : ()=>{
	            currentSet++
	            if(currentSet >= sets.length){
	                currentSet = 0
	            }
	            tileSetLabel.text = `${sets[currentSet]} (${resources[sets[currentSet]].texture.width/16} x ${resources[sets[currentSet]].texture.height/16})`
	            tileSetPalette.setTileSet(sets[currentSet])
	        }
	    })
	
	    tileSetDownButton = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: false,
	        frame: 9,
	        position : {
	            x : 206,
	            y : 0
	        },
	        onClick : ()=>{
	            currentSet--
	            if(currentSet < 0){
	                currentSet = sets.length - 1
	            }
	            tileSetLabel.text = `${sets[currentSet]} (${resources[sets[currentSet]].texture.width/16} x ${resources[sets[currentSet]].texture.height/16})`
	            tileSetPalette.setTileSet(sets[currentSet])
	        }
	    })
	
	    floorLayerButton = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: true,
	        frame: 3,
	        position : {
	            x : 122,
	            y : 0
	        },
	        onClick : ()=>{
	            middleLayerButton.deselect()
	            ceilingLayerButton.deselect()
	            emiter.emit('r4two:editor:show-obstacles', false)
	            selectedLayerEditor = floorLayerButton
	        }
	    })
	
	    middleLayerButton = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: true,
	        frame: 4,
	        position : {
	            x : 140,
	            y : 0
	        },
	        onClick : ()=>{
	            floorLayerButton.deselect()
	            ceilingLayerButton.deselect()
	            emiter.emit('r4two:editor:show-obstacles', true)
	            selectedLayerEditor = middleLayerButton
	        }
	    })
	
	    ceilingLayerButton = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: true,
	        frame: 5,
	        position : {
	            x : 158,
	            y : 0
	        },
	        onClick : ()=>{
	            floorLayerButton.deselect()
	            middleLayerButton.deselect()
	            emiter.emit('r4two:editor:show-obstacles', false)
	            selectedLayerEditor = ceilingLayerButton
	        }
	    })
	
	    obstacleEditor = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: true,
	        frame: 1,
	        position : {
	            x : 64,
	            y : 0
	        },
	        onClick : ()=>{
	            tileEditor.deselect()
	            clearTileEditor.deselect()
	            floorLayerButton.hide()
	            middleLayerButton.hide()
	            ceilingLayerButton.hide()
	            tileSetDownButton.hide()
	            tileSetUpButton.hide()
	            tileSetLabel.visible = false
	            tileSetPalette.hide()
	            selectedEditor = obstacleEditor
	            emiter.emit('r4two:editor:show-obstacles', true)
	        }
	    })
	
	    tileEditor = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: true,
	        frame : 2,
	        position : {
	            x : 82,
	            y : 0
	        },
	        onClick : ()=>{
	            obstacleEditor.deselect()
	            clearTileEditor.deselect()
	            floorLayerButton.show()
	            middleLayerButton.show()
	            ceilingLayerButton.show()
	            tileSetDownButton.show()
	            tileSetUpButton.show()
	            tileSetLabel.visible = true
	            tileSetPalette.show()
	            selectedEditor = tileEditor
	            emiter.emit('r4two:editor:show-obstacles', false)
	        }
	    })
	
	    clearTileEditor = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: true,
	        frame: 13,
	        position : {
	            x : 100,
	            y : 0
	        },
	        onClick : ()=>{
	            obstacleEditor.deselect()
	            tileEditor.deselect()
	            floorLayerButton.hide()
	            middleLayerButton.hide()
	            ceilingLayerButton.hide()
	            tileSetDownButton.hide()
	            tileSetUpButton.hide()
	            tileSetLabel.visible = false
	            tileSetPalette.hide()
	            selectedEditor = clearTileEditor
	            emiter.emit('r4two:editor:show-obstacles', true)
	        }
	    })
	
	    newBoardButton = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: false,
	        frame: 9,
	        position : {
	            x : 0,
	            y : 0
	        },
	        onClick : ()=>{
	        }
	    })
	
	    newBoardButton = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: false,
	        frame: 12,
	        position : {
	            x : 0,
	            y : 0
	        },
	        onClick : ()=>{
	        }
	    })
	
	    saveBoardButton = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: false,
	        frame: 10,
	        position : {
	            x : 18,
	            y : 0
	        },
	        onClick : ()=>{
	            clientCtx.model.save().then((result) => {
	                showNotification(result)
	            })
	        }
	    })
	
	    reloadBoardButton = createEditorIcon({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: false,
	        frame: 11,
	        position : {
	            x : 36,
	            y : 0
	        },
	        onClick : ()=>{
	        }
	    })
	
	    tileSetPalette = createTileSetPalette({
	        parent : editorContainer,
	        graphicsCtx : graphicsCtx,
	        position : {
	            x : 0,
	            y : 20
	        },
	        tileset : sets[currentSet],
	        onClick : (id)=>{
	            currentTexId = id
	            currentMarker.texture = resources[sets[currentSet]].frames[id]
	        }
	    })
	
	    currentMarker = new PIXI.Sprite(resources[sets[currentSet]].frames[0])
	    currentMarker.position.x = 400
	    currentMarker.position.y = 0
	    editorContainer.addChild(currentMarker)
	
	
	    selectedEditor = obstacleEditor
	    selectedEditor.select()
	    floorLayerButton.hide()
	    floorLayerButton.select()
	    selectedLayerEditor = floorLayerButton
	    middleLayerButton.hide()
	    ceilingLayerButton.hide()
	    tileSetDownButton.hide()
	    tileSetUpButton.hide()
	    tileSetLabel.visible = false
	    tileSetPalette.hide()
	
	    emiter.on('r4two:action:editor',()=>{
	        editorContainer.visible = !editorContainer.visible
	        if(editorContainer.visible){
	            emiter.emit('r4two:editor:visible', true)
	            emiter.emit('r4two:editor:show-obstacles', selectedEditor === obstacleEditor)
	            clientCtx.model.setApplyLighting(false)
	        } else {
	            emiter.emit('r4two:editor:visible', false)
	            emiter.emit('r4two:editor:show-obstacles', false)
	            clientCtx.model.setApplyLighting(true)
	        }
	
	    })
	
	    const selectedLayer = ()=>{
	        if(selectedLayerEditor === floorLayerButton){
	            return 'floor'
	        } else if(selectedLayerEditor === middleLayerButton){
	            return 'middle'
	        } else if(selectedLayerEditor === ceilingLayerButton){
	            return 'ceiling'
	        }
	    }
	
	    emiter.on('r4two:board:tileselect', (tile)=>{
	        if(!editorContainer.visible) {
	            return
	        }
	        if(selectedEditor === obstacleEditor){
	            clientCtx.model.setTileObstacle({
	                position : {
	                    x : tile.position.x,
	                    y : tile.position.y
	                },
	                obstacle : !tile.obstacle
	            })
	        } else if(selectedEditor === tileEditor && currentTexId < resources[sets[currentSet]].frames.length){
	            clientCtx.model.setTileTex({
	                position : {
	                    x : tile.position.x,
	                    y : tile.position.y
	                },
	                layer : selectedLayer(),
	                newTex : sets[currentSet]+'_'+currentTexId
	            })
	        } else if(selectedEditor === clearTileEditor){
	            clientCtx.model.setTileTex({
	                position : {
	                    x : tile.position.x,
	                    y : tile.position.y
	                },
	                layer : 'floor',
	                newTex : 'floor_14'
	            })
	            clientCtx.model.setTileTex({
	                position : {
	                    x : tile.position.x,
	                    y : tile.position.y
	                },
	                layer : 'middle',
	                newTex : 'wall_5'
	            })
	            clientCtx.model.setTileTex({
	                position : {
	                    x : tile.position.x,
	                    y : tile.position.y
	                },
	                layer : 'ceiling',
	                newTex : 'wall_5'
	            })
	            clientCtx.model.setTileObstacle({
	                position : {
	                    x : tile.position.x,
	                    y : tile.position.y
	                },
	                obstacle : false
	            })
	        }
	    })
	
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * Created by odrin on 21.09.2015.
	 */
	'use strict'
	/*global PIXI */
	
	module.exports = function createEditorIcon(spec){
	    const graphicsCtx = spec.graphicsCtx
	    const resources = graphicsCtx.resources
	    const selectable = spec.selectable
	    const onClick = spec.onClick
	    const position = spec.position
	    const frame = spec.frame
	    const parent = spec.parent
	
	    const iconContainer = new PIXI.Container()
	    iconContainer.hitArea = new PIXI.Rectangle(0, 0, 16, 16);
	    iconContainer.interactive = true
	    iconContainer.buttonMode = true
	    iconContainer.position = position
	
	    const background = new PIXI.Sprite(resources.editor.frames[frame])
	    background.position.x = 0
	    background.position.y = 0
	    iconContainer.addChild(background)
	
	    const selected = new PIXI.Sprite(resources.editor.frames[0])
	    selected.position.x = 0
	    selected.position.y = 0
	    selected.visible = false
	    iconContainer.addChild(selected)
	
	    iconContainer.on('mousedown', ()=>{
	        if(selectable){
	            selected.visible = !selected.visible
	            onClick(selected.visible)
	        } else {
	            onClick()
	        }
	    })
	
	    parent.addChild(iconContainer)
	
	
	    return {
	        deselect : ()=>{
	            selected.visible = false
	        },
	        select : ()=>{
	            selected.visible = true
	        },
	        hide : ()=>{
	            iconContainer.visible = false
	        },
	        show : ()=>{
	            iconContainer.visible = true
	        }
	    }
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by odrin on 21.09.2015.
	 */
	'use strict'
	/*global PIXI */
	
	const createEditorIcon = __webpack_require__(18)
	
	module.exports = function createTileSetPalette(spec){
	    const graphicsCtx = spec.graphicsCtx
	    const resources = graphicsCtx.resources
	    const onClick = spec.onClick
	    const position = spec.position
	    const parent = spec.parent
	    let tileset = spec.tileset;
	
	    const tileSetPaletteContainer = new PIXI.Container()
	    tileSetPaletteContainer.position = position
	    parent.addChild(tileSetPaletteContainer)
	
	    let nextPaletteButton
	    let prevPaletteButton
	
	    let palette = []
	    let offset = 0
	    let offsetStep = 21
	
	
	
	    const update = ()=>{
	        palette.forEach((el, i)=>{
	            if(i+offset < resources[tileset].frames.length){
	                el.texture = resources[tileset].frames[i+offset]
	            } else {
	                el.texture = resources.wall.frames[5]
	            }
	        })
	    }
	
	    nextPaletteButton = createEditorIcon({
	        parent : tileSetPaletteContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: false,
	        frame: 6,
	        position : {
	            x : 400,
	            y : 0
	        },
	        onClick : ()=>{
	            offset = offset + offsetStep
	            update()
	        }
	    })
	
	    prevPaletteButton = createEditorIcon({
	        parent : tileSetPaletteContainer,
	        graphicsCtx : graphicsCtx,
	        selectable: false,
	        frame: 7,
	        position : {
	            x : 0,
	            y : 0
	        },
	        onClick : ()=>{
	            offset = offset - offsetStep
	            if(offset < 0){
	                offset = 0
	            }
	            update()
	        }
	    })
	
	    for(let i=0; i< offsetStep ; ++i){
	        let p
	        if(i < resources[tileset].frames.length){
	            p = new PIXI.Sprite(resources[tileset].frames[i])
	        } else {
	            p = new PIXI.Sprite(resources.wall.frames[5])
	        }
	        p.position.x = 20 + (i * (16 + 2))
	        p.position.y = 0
	        p.hitArea = new PIXI.Rectangle(0, 0, 16, 16);
	        p.interactive = true
	        p.buttonMode = true
	        p.on('mousedown', ()=>{
	            onClick(i + offset)
	        })
	        palette.push(p)
	        tileSetPaletteContainer.addChild(p)
	    }
	
	    return {
	        setTileSet : (ts)=>{
	            tileset = ts
	            offset = 0
	            update()
	        },
	        show : () =>{
	            tileSetPaletteContainer.visible = true
	        },
	        hide : ()=>{
	            tileSetPaletteContainer.visible = false
	        }
	    }
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map