const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user.model');

//login
router.post('', function(req, res, next) {
  passport.authenticate('local', function loginSuccessful(err, user, info) {
    var jwtToken;

    //db search error
    if (err) {
      res.status(404); //login error
      res.json(err); //reply with the error
      return; //stop function
    }

    //user is found and credentials are correct
    if (user) {
      jwtToken = user.generateJWT();
      res.status(200); //send OK
      res.json({
        "jwt": jwtToken
      }); //respond with the JWT
    }

    //Incorrect email or password
    else {
      res.status(401); //Unauthorized
      res.json(info); //return the info object from passport
    }
  })(req, res);
});

module.exports = router;
