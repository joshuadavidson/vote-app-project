angular
  .module('PollService', [
    'Authentication'
  ])

.factory('PollService', ['$http', 'Authentication', function($http, Authentication) {

  var PollService = {};

    PollService.getPoll = function(pollId) {
      return $http({
        method: 'GET',
        url: '/api/polls/' + pollId
      });
    };

    //get a list of the most recent polls
    PollService.getPolls = function(limit) {
      return $http({
        method: 'GET',
        url: '/api/polls',
        params: {
          limit: limit
        }
      });
    };

    PollService.getUserPolls = function(userId){
      return $http({
        method: 'GET',
        url: '/api/polls/users/'+ userId
      });
    };

    PollService.delete = function(pollId){
      return $http({
        method: 'DELETE',
        url: '/api/polls/'+ pollId,
        headers: {
          Authorization: 'Bearer ' + Authentication.getToken()
        }
      });
    };

    PollService.vote = function(voteChoice, pollId){
      //create data object to pass to API
      var data = {
        vote: voteChoice
      };

      //add the userID if user is logged in
      if (Authentication.isLoggedIn()){
        data.userId = Authentication.getUserId();
      }

      return $http({
        method: 'PUT',
        url: 'api/polls/'+pollId+'/vote',
        data: data
      });
    };

    PollService.newPoll = function(title, questions){
      return $http({
        method: 'POST',
        url: 'api/polls',
        headers: {
          Authorization: 'Bearer ' + Authentication.getToken()
        },
        data: {
          title: title,
          questions: questions,
        }
      });
    };

  return PollService;
}]);
