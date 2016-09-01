const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user.model');

//register
router.post('', function(req, res, next) {

  var user = new User(); //create a new user mongoose object

  //assign properties passed from request
  user.name = req.body.name;
  user.email = req.body.email.toLowerCase(); //ensure email is in lowercase

  //set salt and hash using password
  user.setPassword(req.body.password);

  //add the user to the database
  user.save()

  //generate a token after user is saved
  .then(function(user){
    var token = user.generateJWT();
    res.status(201); //user created
    res.json({ //respond with jwt
      "jwt" : token
    });
  })

  //catch any errors from saving in the database
  .catch(function(err){
    if(err.code === 11000){ //user already exists
      res.status(409); //conflict status
      res.json({
        "message": 'User account already exists. Please Login.'
      });
    } else {
      next(err);
    }
  });
});

module.exports = router;
