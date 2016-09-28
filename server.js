const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const appPassport = require('./config/passport'); //grab the passport function containing config
const compression = require('compression');
const dotenv = require('dotenv');
const app = express();

//Configure application
dotenv.config({ //load env variables
  silent: true, //supress error if no .env file found
  path: './config/.env'
});
appPassport(passport); //run passport configuration
mongoose.Promise = Promise; //configure mongoose to use ES6 promises
app.set('view engine', 'ejs');
app.set('views', './api/views');

//Connect to database, log db events
mongoose.connect(process.env.DB_URI);
mongoose.connection.on('connected', function() {
  console.log('Mongoose db connected to ' + process.env.DB_URI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose db connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected from db.');
});

//MIDDLEWARE***************************************
//Compress all server responses
app.use(compression());

//Parse all request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//passport middleware
app.use(passport.initialize());

//Api routes
app.use('/api', require('./api/routes/api.route'));

//serve static files from public folder
app.use(express.static('public'));
//END MIDDLEWARE***************************************

//send all navigation requests back to angular
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

//error handlers
app.use(function(err, req, res, next) {
  //handle express-jwt authorization errors
  if (err.name === 'UnauthorizedError'){
    res.status(401);
    res.json({
      "message": err.name + ': ' + err.message
    });
  }

  //handle all other errors
  if (!res.headersSent) {
    res.status(err.status || 500);
  }
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : null //only show full err if in development
  });
});

app.listen(process.env.PORT, function() {
  console.log("Server started. Listening on port: " + process.env.PORT);
});
