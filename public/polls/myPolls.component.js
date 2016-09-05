angular
  .module('myPolls', [
    'header',
    'footer',
    'authentication'
  ])

  .component('appMyPolls', {
    templateUrl: './polls/myPolls.template.html',
    controller: ['authentication', function ProfileController(authentication){
      var self = this;

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

    }]
  });
