const express = require('express');
const router = express.Router();

router.route('/:user')

  //route specific middleware
  .all(function(req, res, next){
    next();
  })

  //get user info from db
  .get(function(req, res, next){
    next();
  })

  //update user info in db
  .put(function(req, res, next){
    next();
  })

  //add a new user to db
  .post(function(req, res, next){
    next();
  })

  //delete a user from the db
  .delete(function(req, res, next){
    next();
  });

module.exports = router;
