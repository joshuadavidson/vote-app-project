angular
  .module('header', [
    'ui.bootstrap',
    'Authentication'
  ])

.component('appHeader', {
  templateUrl: './common/header.template.html',
  controller: ['$location', 'Authentication', function HeaderController($location, Authentication) {
    var self = this;

    //isCollapsed toggles when the user selects a link from the navbar menu
    self.isCollapsed = true;

    //check login status
    self.isLoggedIn = Authentication.isLoggedIn();

    //setup an object for the profile data
    self.userData = {};

    //query the api for the current user onced logged in
    if (self.isLoggedIn) {
      Authentication.currentUser()
        //store the users data
        .then(function(response) {
          self.userData = response.data;
        });
    }

    self.logout = function() {
      Authentication.logout();
    };
  }]
});
