var bodyParser = require('body-parser');
var mysql = require('mysql');
var jsonParser = bodyParser.json();

var con = mysql.createConnection({
  host: "localhost",
  user: "thomasd4_dbTest",
  password: "Td11-23-99",
  database: "thomasd4_dbTest"
});

con.connect({ multipleStatements: true });

module.exports = function(app) {
	
	//gets all work Items
	app.get('/work', function(req, res){
		//SELECT workItems.*, workers.name AS worker_name FROM workItems LEFT JOIN workers ON workers.id = workItems.worker_id ORDER BY workItems.id;
		
		con.query("SELECT * FROM workItems WHERE NOT status = 1", function (err, result, fields) {
			if (err) throw err;
				res.render('work', {work: result, workers: [{name: "Abby", id: 1}, {name: "Lucas", id: 2}, {name: "Isaac", id: 3}]});
		});
	});
	
	//adds new work item
	app.post('/work', jsonParser, function(req, res){
		var sql = "INSERT INTO workItems (name, value, status) VALUES ?";
		var values = [[req.body.name, req.body.value, 0]];
		con.query(sql, [values], function (err, result) {
		    if (err) throw err;
		    	console.log("1 record inserted");
		  });
		res.json(req.body);
	});
	
	app.get('/availableworkers', function(req, res){
		con.query("SELECT * FROM workers", function (err, result, fields) {
			if (err) throw err;
		    	res.json(result);
		 });
		//res.render('work', {work: data});
	});
	
	app.patch('/work/claim/:wI', jsonParser, function(req, res){
		var sql = "UPDATE workItems SET worker_id = ? WHERE id = ?";
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
		var sql = "UPDATE workItems SET status = ? WHERE id = ?";
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
		  var sql = "DELETE FROM workItems WHERE id = ?";
		  var value = req.params.wI;
		  con.query(sql, [value], function (err, result) {
		    if (err) throw err;
		    console.log("Number of records deleted: " + result.affectedRows);
		  });
		  res.json(req.body);
	});
};