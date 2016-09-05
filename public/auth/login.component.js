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
      email: null,
      password: null
    };

    self.loginError = null;

    self.onSubmit = function() {
      //if email entered is invalid
      if(!self.credentials.email && self.credentials.password){
        self.loginError = 'Please provide a valid email.';
      }

      //if no password is entered
      if(!self.credentials.password && self.credentials.email){
        self.loginError = 'Please provide a password.';
      }

      //if no email or password were passed
      if(!self.credentials.email && !self.credentials.password){
        self.loginError = 'Please provide a valid email and password.';
      }

      //if both email and password are provided and valid
      if (self.credentials.email && self.credentials.password) {
        authentication.login(self.credentials)
        .then(function() {
          $location.path('/profile');
        })

        .catch(function(err) {
          self.loginError = err.data.message;
        });
      }

    };
  }]
});
