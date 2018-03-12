var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mysql = require('mysql2');
var config = require('../../config');
var con = mysql.createConnection(config.database);
var passport = require('passport');

con.connect();

module.exports = function(app) {
	app.get('/login', function(req, res) {
	
	    // render the page and pass in any flash data if it exists
	    res.render('authentication/login', { message: req.flash('loginMessage') });
	});
	
	app.get('/signup', function(req, res) {
	
	    // render the page and pass in any flash data if it exists
	    res.render('authentication/signup', { message: req.flash('signupMessage') });
	});
	
	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {
	
	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();
	
	    // if they aren't redirect them to the home page
	    res.redirect('/signup');
    }
    

	app.post('/signup', passport.authenticate('local-signup', {
	        successRedirect: '/work',
	 
	        failureRedirect: '/signup'
	    }
	 
	));
	
	app.get('/logout', function(req, res) {
 
	    req.session.destroy(function(err) {
	 
	        res.redirect('/');
	 
	    });
    });
	
	app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/work',
 
        failureRedirect: '/login'
    }
 
));
}