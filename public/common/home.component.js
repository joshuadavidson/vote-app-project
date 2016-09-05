angular
  .module('home', [
  'header',
  'footer',
  'pollService'
])

  .component('appHome', {
    templateUrl: './common/home.template.html',
    controller: ['pollService', function HomeController(pollService){
      var self = this;

      //get a list of the most recent polls to display on the page
      pollService.getPolls().then(function(response){
        console.log(response);
        self.polls = response.data;
      });

    }]
  });
