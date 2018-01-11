var bodyParser = require('body-parser');
var mysql = require('mysql');
var jsonParser = bodyParser.json();

var con = mysql.createConnection({
  multipleStatements: true,
  host: "localhost",
  user: "thomasd4_dbTest",
  password: "Td11-23-99",
  database: "thomasd4_dbTest"
});

con.connect();

module.exports = function(app) {

    //gets all workers
    app.get('/workers', function(req, res) {
        con.query("SELECT WorkerName AS name, WorkerId AS id FROM Worker", function(err, result, fields) {
            if (err) throw err;
            res.render('workers', {
                workers: result
            });
        });
    });

    app.get('/workers/:worker_id', function(req, res) {
        var sql1 = "SELECT ( SELECT WorkerName FROM Worker WHERE WorkerId = ? LIMIT 1) AS name, ( SELECT COUNT(*) FROM Work WHERE WorkerId = ? AND  WorkStatus = 1 ) AS count, ( SELECT SUM(WorkValue) FROM Work WHERE WorkerId = ? AND WorkStatus = 1 ) AS total;";
        var sql2 = "SELECT WorkDescription AS name, WorkValue AS value FROM Work WHERE WorkerId = ? AND WorkStatus = 1;";
        
        var worker_id = req.params.worker_id;
        
        con.query(sql1 + sql2, [worker_id,worker_id,worker_id, worker_id], function(err, results, fields) {
            if (err) throw err;
            var data = results[0][0];
            data.workList = results[1];
            res.render('worker', {
                worker: data
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
};