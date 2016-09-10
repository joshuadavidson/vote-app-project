angular
  .module('home', [
    'header',
    'footer',
    'PollService'
  ])

.component('appHome', {
  templateUrl: './common/home.template.html',
  controller: ['PollService', function HomeController(PollService) {
    var self = this;

    //get a list of the most recent polls to display on the page
    PollService.getPolls(7).then(function(response) {
      self.polls = response.data;
    });

  }]
});
