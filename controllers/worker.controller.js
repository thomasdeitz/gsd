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
        con.query("SELECT * FROM workers", function(err, result, fields) {
            if (err) throw err;
            res.render('workers', {
                workers: result
            });
        });
    });

    app.get('/workers/:worker_id', function(req, res) {
        var sql1 = "SELECT ( SELECT name FROM workers WHERE id = ? LIMIT 1) AS name, ( SELECT COUNT(*) FROM workItems WHERE worker_id = ? AND  status = 1 ) AS count, ( SELECT SUM(value) FROM workItems WHERE worker_id = ? AND status = 1 ) AS total;";
        var sql2 = "SELECT * FROM workItems WHERE worker_id = ? AND status = 1;";
        
        //var sql3 = "SELECT ( SELECT name FROM workers WHERE id = ? LIMIT 1) AS name, ( SELECT COUNT(*) FROM workItems WHERE worker_id = ? AND  status = 1 ) AS count, ( SELECT SUM(value) FROM workItems WHERE worker_id = ? AND status = 1 ) AS total; SELECT * FROM workItems WHERE worker_id = ? AND status = 1;";
        
        var worker_id = req.params.worker_id;
        
        con.query(sql1 + sql2, [worker_id,worker_id,worker_id, worker_id], function(err, results, fields) {
            if (err) throw err;
            var data = results[0][0];
            data.workList = results[1];
            console.log(data);
            res.render('worker', {
                worker: data
            });
        });

    });
};