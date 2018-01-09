var bodyParser = require('body-parser');
var mysql = require('mysql');
var jsonParser = bodyParser.json();

var con = mysql.createConnection({
  host: "localhost",
  user: "thomasd4_dbTest",
  password: "Td11-23-99",
  database: "thomasd4_dbTest"
});

con.connect();

module.exports = function(app) {

    //gets all workers
    app.get('/workers', function(req, res) {
        con.query("SELECT * FROM workers", function(err, result, fields) {
            if (err) throw err;
            res.render('workers', {
                workers: result
            });
        });
        //res.render('work', {work: data});
    });

    app.get('/workers/:worker_id', function(req, res) {
	    //SELECT workItems.*, workers.name AS worker_name FROM workItems LEFT JOIN workers ON workers.id = workItems.worker_id ORDER BY workItems.id;
        //var sql = "SELECT workers.name AS name, SUM(value) AS total, COUNT(workers.id) AS count FROM workers RIGHT JOIN workItems ON workers.id = workItems.worker_id WHERE worker_id = ? AND status = 1"; //godd
        var sql = "SELECT ( SELECT name FROM workers WHERE id = ? LIMIT 1) AS name, ( SELECT COUNT(*) FROM workItems WHERE worker_id = ? AND  status = 1 ) AS count, ( SELECT SUM(value) FROM workItems WHERE worker_id = ? AND status = 1 ) AS total";
        var sql2 = "SELECT * FROM workItems WHERE worker_id = ? AND status = 1";
        var worker_id = req.params.worker_id;

        function myFunction() { 
	        con.query(sql, [worker_id,worker_id,worker_id], function(err, result, fields) {
	            if (err) throw err;
	            con.query(sql2, [worker_id], function(err, result2, fields) {
	            if (err) throw err;
		            result.workList = result2;
		            res.render('worker', {
		                worker: result
		            });
		        });
		        return result;
	        });
        }

		myFunction();
    });
};