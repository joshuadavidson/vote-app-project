angular
  .module('votingApp', [
    'ngRoute',
    'ngResource',
    'Authentication',
    'home',
    'register',
    'login',
    'myPolls',
    'newPoll',
    'poll',
    'pageNotFound'
  ])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  // use the HTML5 History API
  $locationProvider.html5Mode(true);

  $routeProvider.when('/', {
    template: '<app-home></app-home>'
  })

  .when('/register', {
    template: '<app-register></app-register>'
  })

  .when('/login', {
    template: '<app-login></app-login>'
  })

  .when('/mypolls', {
    template: '<app-my-polls></app-my-polls>'
  })

  .when('/newpoll/:pollId', {
    template: '<app-new-poll></app-new-poll>'
  })

  .when('/newpoll', {
    template: '<app-new-poll></app-new-poll>'
  })

  .when('/poll/:pollId/:state', {
    template: '<app-poll></app-poll>'
  })

  .otherwise({
    template: '<app-page-not-found></app-page-not-found>'
  });
}])

//work to be performed after loading all modules
.run(['$rootScope', '$location', 'Authentication', function($rootScope, $location, Authentication) {
  //check every time the route changes to see if user has access to path redirect them to home otherwise
  $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
    var pathAttempt;

    //check to see if nextroute is defined before checking path
    if (nextRoute.$$route) {
      pathAttempt = nextRoute.$$route.originalPath;

      //check if user is trying to access path that neeeds login
      if ((pathAttempt === '/mypolls' ||
      pathAttempt === '/newpoll'|| pathAttempt === '/newpoll/:pollId') && !Authentication.isLoggedIn()) {
        $location.path('/login'); //redirect to login
      }
    }
  });
}]);
