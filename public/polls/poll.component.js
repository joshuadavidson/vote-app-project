angular
  .module('poll', [
    'ngRoute',
    'header',
    'footer',
    'Authentication',
    'PollService'
  ])

.component('appPoll', {
  templateUrl: './polls/poll.template.html',
  controller: ['$routeParams', '$location', '$window', '$anchorScroll', 'Authentication', 'PollService',
    function PollController($routeParams, $location, $window, $anchorScroll, Authentication, PollService) {
      var self = this;

      self.voteChoice = null; //variable to hold user's choice
      self.state = $routeParams.state; //watch the path to detmine which state to show
      self.context = $window.document.getElementById('pollChart'); //est. context for chart
      self.isLoggedIn = Authentication.isLoggedIn(); //check login status
      self.userId = Authentication.getUserId(); //get user id
      self.isOwner = false; //flag if user is owner set once poll is retrieved from db

      self.createPollChart = function() {
        self.pollChart = new Chart(self.context, {
          type: 'doughnut',
          data: {
            labels: self.poll.questions,
            datasets: [{
              label: '# of Votes',
              data: self.poll.responses,
              backgroundColor: [
                'rgba(0, 114, 187, 0.3)',
                'rgba(58, 181, 75, 0.3)',
                'rgba(247, 148, 29, 0.3)',
                'rgba(254, 242, 0, 0.3)',
                'rgba(238, 28, 37, 0.3)',
                'rgba(102, 46, 147, 0.3)',
                'rgba(0, 170, 185, 0.3)',
                'rgba(216, 223, 32, 0.3)',
                'rgba(230,230,230, 0.3)',
                'rgba(170,170,170, 0.3)',
                'rgba(85,85,85, 0.3)',
                'rgba(241, 89, 42, 0.3)',
                'rgba(46, 49, 146, 0.3)',
                'rgba(239, 62, 54, 0.3)',
                'rgba(146, 39, 143, 0.3)',
              ],
              borderColor: [
                'rgb(0, 114, 187)',
                'rgb(58, 181, 75)',
                'rgb(247, 148, 29)',
                'rgb(254, 242, 0)',
                'rgb(238, 28, 37)',
                'rgb(102, 46, 147)',
                'rgb(0, 170, 185)',
                'rgb(216, 223, 32)',
                'rgb(230,230,230)',
                'rgb(170,170,170)',
                'rgb(85,85,85)',
                'rgb(241, 89, 42)',
                'rgb(46, 49, 146)',
                'rgb(239, 62, 54)',
                'rgb(146, 39, 143)',
              ],
              borderWidth: 2,
            }]
          },
          options: {
            legend: {
              position: 'bottom'
            }
          }
        });
      };

      //get the poll from db
      PollService.getPoll($routeParams.pollId)

        //populate the data
        .then(function(response) {
          self.poll = response.data;
          self.isOwner = (self.userId === self.poll.authorId); //set the owner flag

          //handle the creation of the chart
          if (self.state === 'results') {
            self.createPollChart();
          }
        })

        //error in getting poll data
        .catch(function(err){
          $location.path('/'); //redirect to home
        });

      //submit the vote to the db
      self.onSubmit = function() {
        PollService.vote(self.voteChoice, self.poll._id)

        //after submitting vote take user to results
        .then(function(response) {
            $location.path('/poll/' + self.poll._id + '/results');
          })

        //pass error to voteError for display to user
        .catch(function(err) {
          self.voteError = err;
        });
      };

      //handle deleting of poll
      self.delete = function (pollId) {
        var deleteConfirmed = confirm("Are you sure you want to delete this poll? There is no going back.");

        if (deleteConfirmed) {
          //delete from the db
          PollService.delete(pollId)

          //then update the client's polls object
          .then(function(response){
            $location.path('/mypolls');
          });
        }
      };

    }
  ]
});
