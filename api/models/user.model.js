const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },

  hash: String,
  salt: String
}, {
  timestamps: true, //include created and updated timestamps
  retainKeyOrder: true //ensure user document properties are saved in the same order that they are passed in
});

//Set the salt and hash when the user sets their password
userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex'); //create a random 16 byte hex salt
  //create a hash using the password, salt and keystretching
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
};

//Validate an incoming password
userSchema.methods.isValidPassword = function(password) {
  //hash the password using the salt
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
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
