var express = require('express');
var workController = require('./controllers/work.controller');
var workerController = require('./controllers/worker.controller');
var sass = require('node-sass-middleware');
var path = require('path');

var app = express();

// setup template engine
app.set('view engine', 'jade');

// sass files
app.use(
     sass({
	    src: __dirname + '/', 
	    dest: path.join(__dirname, 'assets'),
	    debug: true,       
	})
);

//static files
app.use('/', express.static(path.join(__dirname, 'assets')));﻿

//fire controllers
workController(app);
workerController(app);

//listen to port
app.listen(3000);
console.log('You are listening on port 3000');