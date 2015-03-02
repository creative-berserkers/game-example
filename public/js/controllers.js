var phonecatApp = angular.module('gameApp', ['ngCookies', 'GameServices'])



phonecatApp.controller('GameController', function($scope, $cookieStore, nautilus) {

    nautilus.connect('wss://' + location.host, function(index){
        index.joingame().then(function(response){
            console.log('response'+response)
        })
    })
})