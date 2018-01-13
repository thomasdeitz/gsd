var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
var passport = require('passport');
var flash = require('connect-flash');
var mysql = require('mysql2');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var cookieParser = require('cookie-parser');
var session = require('express-session');
var Sequelize = require('sequelize');
var sass = require('node-sass-middleware');
var path = require('path');

var config = require('./config');

var authController = require('./app/authentication/controller');
var workController = require('./app/work/controller');
var workersController = require('./app/workers/controller');
var workerController = require('./app/worker/controller');

var models = require("./app/models");
var sequelize = new Sequelize(config.database);
require('./config/passport.js')(passport, models.user);

mysql.createConnection(config.database);

// setup template engine
app.set('view engine', 'jade');

// setup view directory
app.set('views', path.join(__dirname, 'app'));

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// sass files
app.use(
     sass({
	    src: __dirname + '/app', 
	    dest: path.join(__dirname, 'app', 'client'),
	    debug: true,       
	})
);

//static files
app.use('/', express.static(path.join(__dirname, 'app', 'client')));﻿

//fire controllers
authController(app, passport);
workController(app);
workersController(app);
workerController(app);

//listen to port
app.listen(port);
console.log('You are listening on port ' + port);

//Models
var models = require("./app/models");
 
//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});

sequelize.query("SELECT * FROM Work").then(myTableRows => {
  console.log(myTableRows)
})