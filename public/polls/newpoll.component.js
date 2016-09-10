angular
  .module('newPoll', [
    'ngRoute',
    'header',
    'footer',
    'Authentication',
    'PollService'
  ])

.component('appNewPoll', {
  templateUrl: './polls/newpoll.template.html',
  controller: ['$routeParams', '$location', '$window', '$anchorScroll', 'Authentication', 'PollService',
    function NewPollController($routeParams, $location, $window, $anchorScroll, Authentication, PollService) {
      var self = this;

      self.poll = {
        title: null,
        questions: {}
      };

      self.poll.questions = [{name: ''}, {name: ''}]; //start page with default question array with two items

      //get the poll from db if pollId is provided in routeParams
      if ($routeParams.pollId) {
        PollService.getPoll($routeParams.pollId)

        //populate the data
        .then(function(response) {
          if (response.data) { //if poll data is found and returned set the new poll fields
            self.poll.title = response.data.title;

            //convert quetsions to array of objects for angular to ng-repeat over
            self.poll.questions = response.data.questions.reduce(function(arr, curr) {
              arr.push({
                name: curr
              });
              return arr;
            }, []);
          }

          //handle the case where no poll was found (i.e. null)
          else {
            self.error = {
              data: {
                message: 'No poll found.'
              }
            }; //create an simple error object
          }
        })

        //if an error response is given capture and display it
        .catch(function(err) {
          self.error = err;
        });
      }

      self.addChoice = function() {
        self.poll.questions.push({
          name: ''
        });
      };

      self.removeChoice = function(index) {
        self.poll.questions.splice(index, 1);
      };

      self.onSubmit = function() {
        //convert questions to array
        var questionArray = self.poll.questions.reduce(function(arr, curr) {
          arr.push(curr.name);
          return arr;
        }, []);

        //check for empty items
        if (questionArray.includes(undefined)|| questionArray.includes('') || self.poll.title === undefined) {
          self.error = {
            data: {
              message: 'Please fill out or remove empty fields.'
            }
          };
        }

        //submit poll to the db
        else {
          PollService.newPoll(self.poll.title, questionArray)

          .then(function(response){
            $location.path('/poll/' + response.data._id + '/view'); //take user to the poll
          })

          //pass error for display to user
          .catch(function(err){
            self.error = err;
          });
        }
      };

    }
  ]
});
