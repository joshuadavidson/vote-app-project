const express = require('express');
const router = express.Router();
const expressJWT = require('express-jwt');
const mongoose = require('mongoose');
const requestIp = require('request-ip'); //use the request-ip package to get user's ip address from header

const Poll = require('../models/poll.model');
const User = require('../models/user.model');

//express-jwt authorization middleware
var authorizeWithJWT = expressJWT({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload' //property name to be attached to the req object
});

//get most recent polls (no authentication needed)
router.get('', function(req, res, next) {

  var limit = parseInt(req.query.limit) || 15; //set the query limit

  //find the most recent 10 polls sorted newest to oldest
  Poll.find({})
    .sort({
      createdAt: 'descending'
    })

  .limit(limit).exec()

  //then return those polls
  .then(function(polls) {
      res.status(200); //status OK
      res.json(polls);
    })
    .catch(function(err) {
      console.log('got error');
      console.log(err);
      next(err); //pass the error to the error handler
    });
});

//get a sepecific poll (no authentication needed)
router.get('/:pollId', function(req, res, next) {
  Poll.findById(req.params.pollId).exec()

  //poll was found or no poll was found (null with no errors)
  .then(function(poll) {
      res.status(200); //status OK
      res.json(poll);
    })

  //handle errors in searching
  .catch(function(err) {
    if(err.name === 'CastError') { //invalid pollId passed
      res.status(400); //bad request status
      res.json({
        "message": 'No poll found due to invalid Poll ID.'
      });
    }

    //all other errors pass to the error handler
    else {
      next(err);
    }
  });
});

//get user polls (no authentication needed)
router.get('/users/:userId', function(req, res, next) {

  //find all polls that the user has created sort them from newest to oldest
  Poll.find({
    authorId: req.params.userId
  }).sort({
    createdAt: 'descending'
  }).exec()

  //then return the polls
  .then(function(polls) {
      res.status(200); //status OK
      res.json(polls);
    })
    .catch(function(err) {
      next(err); //pass the error to the error handler
    });

});

//update poll with a vote from authenticated or unauthenticated user
router.put('/:pollId/vote', function(req, res, next) {
  //if no user ID exists log the users IP address as respondent
  var respondent = req.body.userId ? req.body.userId : requestIp.getClientIp(req);

  Poll.findById(req.params.pollId).exec()

  .then(function(poll) {
    //verify that the respondent has not arlready voted
    if (poll.alreadyVoted(respondent)) {
      res.status(409); //conflict status
      res.json({
        "message": 'You have already voted from this computer or user account.'
      });
    }

    //verify that user made a choice when voting
    else if (req.body.vote === null) {
      res.status(400); //bad request status
      res.json({
        "message": 'No choice made. Please make a selection.'
      });
    }

    //process the vote
    else {
      poll.respondents.push(respondent); //add the respondent to the list
      poll.responses[req.body.vote]++;// = poll.responses[req.body.vote] + 1; //tally the vote for the users choice
      poll.markModified('responses');
      poll.save() //save to the db
      //after save respond with status
      .then(function(poll) {
          res.status(200); //status OK
          res.end();
      })
      //if there was an error during save then pass it to the error handler
      .catch(function(err) {
        next(err); //pass the error to the error handler
      });
    }
  })
  .catch(function(err) {
    next(err); //pass the error to the error handler
  });

});

//udpate a poll (authenticate the user)
router.put('/:pollId', authorizeWithJWT, function(req, res, next) {
  //if no user ID exists in the JWT return Unauthorized 401
  if (!req.payload._id) {
    res.status(401); //unauthorized
    res.json({
      "message": "UnauthorizedError: private poll"
    });
  }

  //if id exists then check that id matches author
  else {
    //create db searches to execute simulatneously
    var findUser = User.findById(req.payload._id).exec();
    var findPoll = Poll.findById(req.params.pollId).exec();

    //run db searches simulataneously
    Promise.all([findUser, findPoll])

    //user and poll found
    .then(function(results) {
        var user = results[0];
        var poll = results[1];

        //check to see if the userId and poll authorId are equal
        if (user._id.toString() === poll.authorId) {
          //update the poll
          poll.title = req.body.title;
          poll.questions = req.body.questions;
          poll.save() //save to the db

          //after save respond with status
          .then(function(poll) {
            res.status(200); //status OK
            res.end();
          })

          //if there was an error during save then pass it to the error handler
          .catch(function(err) {
            next(err); //pass the error to the error handler
          });
        }

        //if ids don't match then return unauthorized
        else {
          res.status(401); //unauthorized
          res.json({
            "message": "UnauthorizedError: private poll"
          });
        }
      })
      .catch(function(err) {
        next(err); //pass the error to the error handler
      });
  }
});

//create a new poll (authenticate the user)
router.post('', authorizeWithJWT, function(req, res, next) {
  //if no user ID exists in the JWT return Unauthorized 401
  if (!req.payload._id) {
    res.status(401); //unauthorized
    res.json({
      "message": "UnauthorizedError: must log in to create poll"
    });
  }

  //if id exists then create a new poll
  else {
    var poll = new Poll(); //create a new poll mongoose object

    poll.title = req.body.title;
    poll.authorId = req.payload._id; //use the id from the JWT as the author
    poll.questions = req.body.questions;
    poll.responses = new Array(poll.questions.length).fill(0); //create an array the same length as the number of questions with values equal to 0
    poll.respondents = []; //save empty array for new poll

    poll.save()

    .then(function(poll) {
        res.status(201); //created
        res.json(poll); //return created poll
      })
      .catch(function(err) {
        next(err); //pass error to error handler
      });
  }
});

//delete a poll (authenticate the user)
router.delete('/:pollId', authorizeWithJWT, function(req, res, next) {
  //if no user ID exists in the JWT return Unauthorized 401
  if (!req.payload._id) {
    res.status(401); //unauthorized
    res.json({
      "message": "UnauthorizedError: private poll"
    });
  }

  //if id exists then check that id matches author
  else {
    //create db searches to execute simulatneously
    var findUser = User.findById(req.payload._id).exec();
    var findPoll = Poll.findById(req.params.pollId).exec();

    //run db searches simulataneously
    Promise.all([findUser, findPoll])

    //user and poll found
    .then(function(results) {
        var user = results[0];
        var poll = results[1];

        //check to see if the userId and poll authorId are equal
        if (user._id.toString() === poll.authorId) {
          //update the poll
          poll.remove()

          //after deleting doc respond with status
          .then(function(poll) {
            res.status(200); //status OK
            res.end();
          })

          //if there was an error during delete then pass it to the error handler
          .catch(function(err) {
            next(err); //pass the error to the error handler
          });
        }

        //if ids don't match then return unauthorized
        else {
          res.status(401); //unauthorized
          res.json({
            "message": "UnauthorizedError: private poll"
          });
        }
      })
      .catch(function(err) {
        next(err); //pass the error to the error handler
      });
  }

});

module.exports = router;
