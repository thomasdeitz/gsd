var mysql = require('mysql');
var config = require('../config');

mysql.createConnection(config.database).connect();

module.exports = function(app) {
	app.get('/signup', function(req, res) {
	
	    // render the page and pass in any flash data if it exists
	    res.render('signup', { message: req.flash('signupMessage') });
	});
	
	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {
	
	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();
	
	    // if they aren't redirect them to the home page
	    res.redirect('/signup');
    }
}