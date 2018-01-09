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
	    dest: __dirname + '../../public_html/tom',
	    debug: true,       
	})
);

//static files
app.use(express.static(__dirname + '../../public_html/tom'));﻿

//fire controllers
workController(app);
workerController(app);

//listen to port
app.listen(3000);
console.log('You are listening on port 3000');