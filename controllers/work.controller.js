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

con.connect({ multipleStatements: true });

module.exports = function(app) {
	
	//gets all work Items
	app.get('/work', function(req, res){
		var getWork = "SELECT * FROM Work WHERE NOT WorkStatus = 1;";
		var getWorkers = "SELECT WorkerName, WorkerId FROM Worker;";
		
		
		con.query(getWork + getWorkers, function (err, result, fields) {
			if (err) throw err;
				res.render('work', {work: result[0], workers: result[1]});
				console.log(result);
		});
	});
	
	//adds new work item
	app.post('/work', jsonParser, function(req, res){
		var sql = "INSERT INTO Work (WorkDescription, WorkValue, WorkStatus) VALUES ?";
		var values = [[req.body.name, req.body.value, 0]];
		con.query(sql, [values], function (err, result) {
		    if (err) throw err;
		    	console.log("1 record inserted");
		  });
		res.json(req.body);
	});
	
	app.get('/availableworkers', function(req, res){
		con.query("SELECT * FROM Worker", function (err, result, fields) {
			if (err) throw err;
		    	res.json(result);
		 });
	});
	
	app.patch('/work/claim/:wI', jsonParser, function(req, res){
		var sql = "UPDATE Work SET WorkerId = ? WHERE WorkId = ?";
		var worker = [[req.body.worker_id]];
		var wi = req.params.wI;
		console.log(sql, worker, wi);
			con.query(sql, [worker, wi], function (err, result) {
			    if (err) throw err;
			    	console.log("1 record updated");
			  });
			res.json(req.body);
	});
	
	app.patch('/work/status/:wI', jsonParser, function(req, res){
		var sql = "UPDATE Work SET WorkStatus = ? WHERE WorkId = ?";
		var status_id = [[req.body.status]];
		var wi = req.params.wI;
		console.log(sql, status_id, wi);
			con.query(sql, [status_id, wi], function (err, result) {
			    if (err) throw err;
			    	console.log("1 record updated");
			  });
			res.json(req.body);
	});
	
	//deletes work item
	app.delete('/work/:wI', function(req, res){
		  var sql = "DELETE FROM Work WHERE WorkId = ?";
		  var value = req.params.wI;
		  con.query(sql, [value], function (err, result) {
		    if (err) throw err;
		    console.log("Number of records deleted: " + result.affectedRows);
		  });
		  res.json(req.body);
	});
};