angular
.module('votingApp', [
  'ngRoute',
  'ngResource',
  'authentication',
  'home',
  'register',
  'login',
  'profile',
  'myPolls'
])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  // use the HTML5 History API
  $locationProvider.html5Mode(true);

  $routeProvider.when('/', {
    template: '<app-home></app-home>',
  })

  .when('/register', {
    template: '<app-register></app-register>',
  })

  .when('/login', {
    template: '<app-login></app-login>',
  })

  .when('/profile', {
    template: '<app-profile></app-profile>',
  })

  .when('/mypolls', {
    template: '<app-my-polls></app-my-polls>'
  })

  .otherwise({
    templateUrl: '404.html'
  });
}])

//work to be performed after loading all modules
.run(['$rootScope', '$location', 'authentication', function($rootScope, $location, authentication){
  //check every time the route changes to see if user has access to path redirect them to home otherwise
  $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute){
    if(nextRoute.$$route.originalPath === '/profile' && !authentication.isLoggedIn()){
      $location.path('/');//redirect to home
    }
  });
}]);
