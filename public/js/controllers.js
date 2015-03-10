angular.module('gameApp', ['GameServices', 'ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/game/:gameId/home', {
        templateUrl: 'views/game-home.html',
        controller: 'GameHomeCtrl',
        controllerAs: 'gameHome'
      })
      .otherwise({
        redirectTo: '/login'
      });

    $locationProvider.html5Mode(true);
  }])
  .controller('GameController', ['$scope', '$location', 'nautilus', 'settings','game', function($scope, $location, nautilus, settings, game) {
    $scope.join = function(username, rememberme) {
      nautilus.session(function(session) {
        session.join(username).then(function(g) {
          game.init(g)
          settings.setUsername(username)
          settings.setRememberMeEnabled(rememberme)
          $location.path('/game/' + g.id + '/home')
        })
      })
    }
    if (settings.isRememberMeEnabled()) {
      nautilus.session(function(session) {
        session.join($scope.username).then(function(g) {
          game.init(g)
          $location.path('/game/' + g.id + '/home')
        })
      })
    }
  }])
  .controller('LoginCtrl', function($scope, $cookieStore, nautilus) {

  })
  .controller('GameHomeCtrl', function($scope, $cookieStore, nautilus) {

  })