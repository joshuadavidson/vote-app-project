angular
  .module('myPolls', [
    'header',
    'footer',
    'Authentication',
    'PollService'
  ])

  .component('appMyPolls', {
    templateUrl: './polls/myPolls.template.html',
    controller: ['Authentication', 'PollService', function MyPollsController(Authentication, PollService){
      var self = this;

      //check login status
      self.isLoggedIn = Authentication.isLoggedIn();

      //setup an object for the profile data
      self.userData = {};

      //query the api for the current user onced logged in and grab their polls
      if (self.isLoggedIn) {
        //get user data
        Authentication.currentUser()
          //store the users data
          .then(function(response) {
            self.userData = response.data;
          });

        //get polls for the user
        PollService.getUserPolls(Authentication.getUserId())
        //store the user's polls
        .then(function(response){
          self.polls = response.data;
        });
      }

      //handle deleting of poll
      self.delete = function (pollId) {
        var deleteConfirmed = confirm("Are you sure you want to delete this poll? There is no going back.");

        if (deleteConfirmed) {
          //delete from the db
          PollService.delete(pollId)

          //then update the client's polls object
          .then(function(response){
            PollService.getUserPolls(Authentication.getUserId())

            //store the new user's polls
            .then(function(response){
              self.polls = response.data;
            });
          });
        }
      };

    }]
  });
