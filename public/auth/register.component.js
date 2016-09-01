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
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };

    self.onSubmit = function() {
      console.log("Registering User.");
      authentication.register(self.credentials)
        .then(function() {
          console.log("User has been successfully registered");
          $location.path('/profile');
        })

        .catch(function(err) {
          alert(err);
        });
    };
  }]
});
