var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var port = 3000;

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// Set Static Path
app.use(express.static(path.join(__dirname,'public')));

//connect to MongoDB
mongoose.connect('mongodb://localhost/arkelltech');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'best practice',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
			title: 'arkell tech inc',
			error: 'Error: '+err.message
		});
});

// listen on port
app.listen(port, function () {
  console.log('Arkell Tech listening on port '+port);
});