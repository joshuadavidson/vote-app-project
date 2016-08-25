const express = require('express');
const compression = require('compression');

//Configure application
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', './app/views');

//Compress all server responses
app.use(compression());

//serve static files from public folder
app.use(express.static('public'));

//application routes
app.use('/api', require('./app/routes/api.route'));

//send all navigation requests back to angular
app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

//catch 404 errors
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404', {
    message: err.message,
    error: err
  });
});

//error handlers
app.use(function(err, req, res, next) {
  if (!res.headersSent) {
    res.status(err.status || 500);
  }
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : null //only show full err if in development
  });
});

app.listen(port, function(){
  console.log("Server started. Listening on port: "+ port);
});
