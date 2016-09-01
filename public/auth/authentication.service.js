angular
  .module('authentication', [])

.factory('authentication', ['$http', '$window', function($http, $window) {
  //save the token to the client's local storage to persist between sessions
  var saveToken = function(token) {
    //only save token if it exists
    if (token) {
      $window.localStorage.setItem('votingAppJWT', token);
    }
  };

  //retrieve the token from local storage
  var getToken = function() {
    return $window.localStorage.getItem('votingAppJWT');
  };

  //delete the token from local storage to logout the user
  var logout = function() {
    console.log("Logging out via authentication service.");
    $window.localStorage.removeItem('votingAppJWT');
  };

  //check if user is logged in
  var isLoggedIn = function() {
    console.log("Checking logged in via authentication service.");
    var jwt = getToken();
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
  var getUserid = function() {
    console.log("Getting user id via authentication service.");
    //check to see if jwt exists
    if (isLoggedIn()) {
      var jwt = getToken();
      var jwtPayload;
      jwtPayload = jwt.split('.')[1]; //get the payload portion of the jwt
      jwtPayload = $window.atob(jwtPayload); //decode the base64 jwt payload
      jwtPayload = JSON.parse(jwtPayload); //convert string payload into object

      return jwtPayload._id;
    } else {
      return null; //user not logged in
    }
  };

  var currentUser = function() {
    console.log("Getting current user via authentication service.");
    //lookup the user
    var id = getUserid();

    //grab the profile data
    return $http({
      method: 'GET',
      url: '/api/profile',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      data: id
    });
  };

  var register = function(credentials) {
    console.log("Registering user via authentication service.");
    return $http.post('/api/register', credentials)
      //after successful post save the token
      .then(function(response) {
        saveToken(response.data.jwt);
      });
    //errors handled where signup function is invoked
  };

  var login = function(credentials) {
    console.log("Logging in user via authentication service.");
    return $http.post('/api/login', credentials)
      //after successful post save the token
      .then(function(response) {
        saveToken(response.data.jwt);
      });
    //errors handled where login function is invoked
  };

  return {
    saveToken: saveToken,
    getToken: getToken,
    logout: logout,
    isLoggedIn: isLoggedIn,
    getUserid: getUserid,
    currentUser: currentUser,
    register: register,
    login: login
  };

}]);
