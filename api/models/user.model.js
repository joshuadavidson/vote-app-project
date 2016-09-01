const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
}, {retainKeyOrder: true }); //ensure user document properties are saved in the same order that they are passed in

//Set the salt and hash when the user sets their password
userSchema.methods.setPassword = function(password) {
  console.log("Setting Password: "+password);
  this.salt = crypto.randomBytes(16).toString('hex'); //create a random 16 byte hex salt
  //create a hash using the password, salt and keystretching
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
};

//Validate an incoming password
userSchema.methods.isValidPassword = function(password) {
  console.log(password);
  //hash the password using the salt
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
  console.log("Password hash: "+ hash);
  console.log("Stored hash: " + this.hash);
  //compare hashes
  return this.hash === hash;
};

userSchema.methods.generateJWT = function() {

  var jwtOptions = {
    expiresIn: "7 days"
  };

  return jwt.sign({
    _id: this._id
  }, process.env.JWT_SECRET, jwtOptions);
};

module.exports = mongoose.model('User', userSchema);
