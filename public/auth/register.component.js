angular
  .module('register', [
    'header',
    'footer',
    'authentication'
  ])

.component('appRegister', {
  templateUrl: './auth/register.template.html',
  controller: ['$http', '$location', 'authentication', function RegisterController($http, $location, authentication) {
    var self = this;

    //create an object to hold form data
    self.credentials = {
      name: null,
      email: null,
      password: null
    };

    self.onSubmit = function() {
      //if no password is entered
      if(!self.credentials.password){
        self.loginError = 'Please provide a password.';
      }

      //if email entered is invalid
      if(!self.credentials.email){
        self.loginError = 'Please provide a valid email.';
      }

      //if no name is entered
      if(!self.credentials.name){
        self.loginError = 'Please provide your name.';
      }

      if (self.credentials.name && self.credentials.email && self.credentials.password) {

        authentication.register(self.credentials)
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
