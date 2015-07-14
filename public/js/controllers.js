angular.module('gameApp', ['GameServices', 'ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/game/home', {
        templateUrl: 'views/game-home.html',
        controller: 'GameHomeCtrl',
        controllerAs: 'gameHome'
      })
      .otherwise({
        redirectTo: '/login'
      });

    $locationProvider.html5Mode(true);
  }])
  .controller('GameController', ['$scope', '$location', 'nautilus', 'settings', function($scope, $location, nautilus, settings) {
    $scope.index = {
      players : []
    }  
    
    nautilus.index(function(index) {
      angular.copy(index,$scope.index)
    });
    
    $scope.join = function(username, rememberme) {
      var uniqueId = settings.uniqueId()
      if(uniqueId === undefined){
        settings.setUniqueId( guid() )
        uniqueId = settings.uniqueId()
      } 
       
      nautilus.index(function(index) {
        index.registerSession(uniqueId, username).then(function(){
          settings.setUsername(username)
          settings.setRememberMeEnabled(rememberme)
          $location.path('/game/home')
        })
      })
    }
    
    if (settings.isRememberMeEnabled()) {
      nautilus.index(function(index) {
        index.registerSession(settings.uniqueId(), settings.username()).then(function(){
          $location.path('/game/home')
        })
      })
    }
  }])
  .controller('LoginCtrl', function($scope, nautilus) {

  })
  .controller('GameHomeCtrl', function($scope, nautilus) {
    $scope.index = {
      players : []
    } 
    
    nautilus.index(function(index) {
      angular.copy(index,$scope.index)
    })
  })