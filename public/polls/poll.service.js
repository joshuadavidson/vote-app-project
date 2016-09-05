angular
  .module('pollService', [
    'authentication'
  ])

.factory('pollService', ['$http', 'authentication', function($http, authentication) {

  //get a list of the most recent polls
  var getPolls = function(limit){
    return $http({
      method: 'GET',
      url: '/api/polls',
      params: {limit: limit}
    });
  };

  return {
    getPolls: getPolls
  };
}]);
