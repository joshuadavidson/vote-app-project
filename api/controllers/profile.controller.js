const express = require('express');
const router = express.Router();
const expressJWT = require('express-jwt');
const mongoose = require('mongoose');

const User = require('../models/user.model');

//express-jwt authorization middleware
var authorizeWithJWT = expressJWT({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload' //property name to be attached to the req object
});

//get profile using authorization middleware
router.get('', authorizeWithJWT, function(req, res, next) {

  //if no user ID exists in the JWT return Unauthorized 401
  if (!req.payload._id) {
    res.status(401);
    res.json({
      "message": "UnauthorizedError: private profile"
    });
  }

  //if id exists then respond with user object
  else {
    //find the user
    User.findById(req.payload._id).exec()

    //then return the user data
    .then(function(user){
      res.status(200); //status OK
      res.json(user);
    })
    .catch(function(err){
      next(err); //pass the error to the error handler
    });
  }

});

module.exports = router;
