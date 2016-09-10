angular
  .module('Authentication', [])

.factory('Authentication', ['$http', '$window', function($http, $window) {

  var Authentication = {};

  //save the token to the client's local storage to persist between sessions
  Authentication.saveToken = function(token) {
    //only save token if it exists
    if (token) {
      $window.localStorage.setItem('votingAppJWT', token);
    }
  };

  //retrieve the token from local storage
  Authentication.getToken = function() {
    return $window.localStorage.getItem('votingAppJWT');
  };

  //delete the token from local storage to logout the user
  Authentication.logout = function() {
    $window.localStorage.removeItem('votingAppJWT');
  };

  //check if user is logged in
  Authentication.isLoggedIn = function() {
    var jwt = Authentication.getToken();
    var jwtPayload;

    //if jwt exists check its expiry date
    if (jwt) {
      jwtPayload = jwt.split('.')[1]; //get the payload portion of the jwt
      jwtPayload = $window.atob(jwtPayload); //decode the base64 jwt payload
      jwtPayload = JSON.parse(jwtPayload); //convert string payload into object

      //ensure that the jwt is still valid
      return jwtPayload.exp > Date.now() / 1000;
    }

    //if no jwt exists return false
    else {
      return false;
    }
  };

  //get the user id from the jwt
  Authentication.getUserId = function() {
    //check to see if jwt exists
    if (Authentication.isLoggedIn()) {
      var jwt = Authentication.getToken();
      var jwtPayload;
      jwtPayload = jwt.split('.')[1]; //get the payload portion of the jwt
      jwtPayload = $window.atob(jwtPayload); //decode the base64 jwt payload
      jwtPayload = JSON.parse(jwtPayload); //convert string payload into object

      return jwtPayload._id;
    } else {
      return null; //user not logged in
    }
  };

  Authentication.currentUser = function() {
    //lookup the user
    var id = Authentication.getUserId();

    //grab the profile data
    return $http({
      method: 'GET',
      url: '/api/profile',
      headers: {
        Authorization: 'Bearer ' + Authentication.getToken()
      },
      data: id
    });
  };

  Authentication.register = function(credentials) {
    return $http.post('/api/register', credentials)
      //after successful post save the token
      .then(function(response) {
        Authentication.saveToken(response.data.jwt);
      });
    //errors handled where signup function is invoked
  };

  Authentication.login = function(credentials) {
    return $http.post('/api/login', credentials)
      //after successful post save the token
      .then(function(response) {
        Authentication.saveToken(response.data.jwt);
      });
    //errors handled where login function is invoked
  };

  return Authentication;

}]);
