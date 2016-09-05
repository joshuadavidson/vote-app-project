angular
  .module('header', [
    'ui.bootstrap',
    'authentication'
  ])

.component('appHeader', {
  templateUrl: './common/header.template.html',
  controller: ['$location', 'authentication', function HeaderController($location, authentication) {
    var self = this;

    //isCollapsed toggles when the user selects a link from the navbar menu
    self.isCollapsed = true;

    //check login status
    self.isLoggedIn = authentication.isLoggedIn();

    //setup an object for the profile data
    self.userData = {};

    //query the api for the current user onced logged in
    if (self.isLoggedIn) {
      authentication.currentUser()
        //store the users data
        .then(function(response) {
          self.userData = response.data;
        });
    }

    self.logout = function() {
      authentication.logout();
    };
  }]
});
