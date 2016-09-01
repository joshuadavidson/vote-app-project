const LocalStrategy = require('passport-local').Strategy;
const User = require('../api/models/user.model');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //user logs in using email and password
  passport.use(new LocalStrategy({
      usernameField: 'email', //use email rather than passport default username
    },

    function(email, password, done) {

      User.findOne({
        email: email
      }, function(err, user) { //search for the user by the email provided
        //error from searching the db
        if (err) {
          return done(err);
        }

        //user object was not found due to incorrect email
        if (!user) {
          return done(null, false, {
            message: 'Incorrect email.'
          });
        }

        //user object was found but incorrect password
        if (!user.isValidPassword(password)) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }

        //user found and password correct
        return done(null, user);
      });
    }
  ));
};
