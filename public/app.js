//Application module
var votingApp = angular.module('votingApp', ['ngRoute', 'ngResource']);

//Angular routing
votingApp.config(function($routeProvider, $locationProvider){
  // use the HTML5 History API
  $locationProvider.html5Mode(true);

  $routeProvider.when('/', {
    templateUrl: 'pages/home.html',
    controller: 'homeCtrl'
  })

  .when('/signup', {
    templateUrl: 'pages/signup.html',
    controller: 'signupCtrl'
  })

  .when('/login', {
    templateUrl: 'pages/login.html',
    controller: 'loginCtrl'
  })

  .when('/profile', {
    templateUrl: 'pages/profile.html',
    controller: 'profileCtrl'
  })

  .otherwise({
    templateUrl: 'pages/404.html'
  });
});

//Angular services

//Angular controllers
votingApp.controller('homeCtrl', ['$scope', function($scope){

}]);

votingApp.controller('signupCtrl', ['$scope', function($scope){

}]);

votingApp.controller('loginCtrl', ['$scope', function($scope){

}]);

votingApp.controller('profileCtrl', ['$scope', function($scope){

}]);
