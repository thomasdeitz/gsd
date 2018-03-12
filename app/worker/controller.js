var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mysql = require('mysql2');
var config = require('../../config');
var con = mysql.createConnection(config.database);

con.connect();

module.exports = function(app) {
    app.get('/worker/:worker_id', isLoggedIn, function(req, res) {
        var sql1 = "SELECT ( SELECT WorkerName FROM Worker WHERE WorkerId = ? LIMIT 1) AS name, ( SELECT COUNT(*) FROM Work WHERE WorkerId = ? AND  WorkStatus = 1 ) AS count, ( SELECT SUM(WorkValue) FROM Work WHERE WorkerId = ? AND WorkStatus = 1 ) AS total;";
        var sql2 = "SELECT WorkDescription AS name, WorkValue AS value FROM Work WHERE WorkerId = ? AND WorkStatus = 1;";
        
        var worker_id = req.params.worker_id;
        
        con.query(sql1 + sql2, [worker_id,worker_id,worker_id, worker_id], function(err, results, fields) {
            if (err) throw err;
            var data = results[0][0];
            data.workList = results[1];
            res.render('worker', {
                worker: data,
                user: res.user
            });
        });

    });
    
    //adds new worker
	app.post('/worker', jsonParser, function(req, res){
		var sql = "INSERT INTO Worker (WorkerName, Gender) VALUES ?";
		var values = [[req.body.worker, req.body.gender]];
		console.log(values);
		con.query(sql, [values], function (err, result) {
		    if (err) throw err;
		    console.log("1 record inserted");
		    console.log(values);
		  });
		res.json(req.body);
	});
	
	//are you logged in
	function isLoggedIn(req, res, next) {
		
		console.log('run', req)
		//res.user = req.session.passport.user;
		res.user = req.user;
		

	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();
	
	    // if they aren't redirect them to the home page
	    	res.redirect('/login');
	}
};