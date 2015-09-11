export function createContainer(renderer){
    'use strict'
    // create an new instance of a pixi stage

    var container = new PIXI.Container();
    
    container.scale.x = 8;
    container.scale.y = 8;
    container.position.x = 0
    container.position.y = 0
    
    
    var screenWidth = document.documentElement.clientWidth
    var screenHeight = document.documentElement.clientHeight

    function isInFullScreenMode() {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            return false
        }
        return true
    }

    function onFullScreenChange() {
        if (isInFullScreenMode()) {
            console.log("We are entering fullscreen");
            //renderer.view.width = window.screen.width;
            //renderer.view.height = window.screen.height;
            renderer.resize(window.screen.width, window.screen.height)
            var ratio = window.screen.height/window.screen.width
            container.scale.x = window.screen.width/160;
            container.scale.y = window.screen.height/(160*ratio);
        }
        else {
            console.log("We are leaving fullscreen");
            //renderer.view.width = screenWidth
            //renderer.view.height = screenHeight
            renderer.resize(screenWidth, screenHeight)
            var ratio = screenHeight/screenWidth
            container.scale.x = screenWidth/160;
            container.scale.y = screenHeight/(160*ratio);
        }
    }

    function RequestFullscreen() {
        var elem = document.getElementsByTagName("canvas")[0];

        if (elem.requestFullscreen) {
            document.addEventListener("fullscreenchange", onFullScreenChange, false)
            elem.requestFullscreen();
        }
        else if (elem.msRequestFullscreen) {
            document.addEventListener("msfullscreenchange", onFullScreenChange, false)
            elem.msRequestFullscreen();
        }
        else if (elem.mozRequestFullScreen) {
            document.addEventListener("mozfullscreenchange", onFullScreenChange, false)
            elem.mozRequestFullScreen();
        }
        else if (elem.webkitRequestFullscreen) {
            document.addEventListener("webkitfullscreenchange", onFullScreenChange, false)
            elem.webkitRequestFullscreen();
        }
    }
    
    window.onresize = function(event) {
        screenWidth = document.documentElement.clientWidth
        screenHeight = document.documentElement.clientHeight
        onFullScreenChange();
    };
    
    onFullScreenChange()
    
    return container;
}