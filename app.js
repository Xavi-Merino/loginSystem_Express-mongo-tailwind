var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();

//import the session module and the MongoDBStore module
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//create a new instance of the express application
var app = express();


/*create a new instance of the MongoDBStore and pass in the URI(conection string) and the collection name
this will create a new collection in the database to store the sessions*/ //HERE IS WHERE THE DB CONNECTION IS MADE
var store = new MongoDBStore({
  uri: process.env.DB_URI, //connection string stored in the .env file
  collection: 'mySessions'
});

// Catch errors and show them in the console
store.on('error', function(error) {
  console.log(error);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(__dirname + "/public"));

//use the session middleware and configuring the session options,
//this is impportant to maintain the user logged in while is using the app.
app.use(require('express-session')({
  key: 'user_sid',
  secret: process.env.SESSION_SECRET, //secret stored in the .env file	
  cookie: { // The cookie settings
    maxAge: 1000 * 60 * 60 * 24, // 1 day, this is the max age of the cookie, after this time the cookie will be deleted and the user will have to log in again
    httpOnly: true, // The cookie is not available via JavaScript in the browser
    //secure: true, // The cookie will only be sent over HTTPS, THIS IS RECOMENDED FOR PRODUCTION
    sameSite: true // The cookie will only be sent to the same site that it came from
  },
  store: store, //pass in the store instance we created
  resave: true,
  /*saveUninitialized is set to false to prevent the session from being saved in the store if it hasn't been modified, this option is recomended
    to count the times the user visit a view*/
  saveUninitialized: true 
}));



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
