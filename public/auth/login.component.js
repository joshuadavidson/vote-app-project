angular
  .module('login', [
    'header',
    'footer',
    'authentication'
  ])

.component('appLogin', {
  templateUrl: './auth/login.template.html',
  controller: ['$http', '$location', 'authentication', function LoginController($http, $location, authentication) {
    var self = this;

    //create an object to hold form data
    self.credentials = {
      email: '',
      password: ''
    };

    self.onSubmit = function() {
      authentication.login(self.credentials)
      .then(function() {
        console.log("User has been successfully logged in");
        $location.path('/profile');
      })

      .catch(function(err) {
        console.log(err);
      });
    };
  }]
});
