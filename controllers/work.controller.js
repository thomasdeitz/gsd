const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Client, Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || {
  user: 'thomasd4_test',
  host: 'localhost',
  database: 'thomasd4_gp',
  password: 'test1',
  port: 5432
};

const pool = new Pool(connectionString);

module.exports = function(app) {
  //pool.query("CREATE SEQUENCE work_id_seq; ALTER TABLE work ALTER COLUMN work_id SET DEFAULT NEXTVAL('work_id_seq');");
  
  app.get('/', function(req, res){
    res.render('home')
	});
  
  //gets all work Items
	app.get('/work', function(req, res){
		var getWork = "SELECT * FROM work WHERE work_status NOT IN (1);";
		var getWorkers = "SELECT worker_name, worker_id FROM worker;";
		
		pool.query(getWork + getWorkers, (err, result) => {
			if (err) {
          console.log(err.stack)
        } else {
          res.render('work', {work: result[0].rows, workers: result[1].rows})
			 }
		});
	});

	//adds new work item
	app.post('/work', jsonParser, function(req, res){
		var addWork = "INSERT INTO work (work_description, work_value, work_status) VALUES ($1, $2, $3)";
		var values = [req.body.name, req.body.value, 0];
		pool.query(addWork, values, (err, result) => {
		    if (err) {
          console.log(err.stack)
        } else {
          res.json(req.body);
        }
		  });
	});

	app.get('/availableworkers', function(req, res){
		pool.query("SELECT * FROM worker", (err, result, fields) => {
			if (err) {
          console.log(err.stack)
        } else {
          console.log(fields);
          res.json(result[0]);
			 }
		 });
	});

	app.patch('/work/claim/:wI', jsonParser, function(req, res){
		var claimWork = "UPDATE work SET worker_id = $1 WHERE work_id = $2";
		var values = [req.body.worker_id, req.params.wI];
		console.log(values);
		pool.query(claimWork, values, (err, result) => {
		    if (err) {
          console.log(err.stack)
        } else {
          res.json(req.body);
        }
		  });
	});


	app.patch('/work/status/:wI', jsonParser, function(req, res){
		var updateStatus = "UPDATE work SET work_status = $1 WHERE work_id = $2";
		var values = [req.body.status, req.params.wI];
		console.log(updateStatus, status_id, wi);
		pool.query(pool, values, (err, result) => {
      if (err) {
        console.log(err.stack)
      } else {
        res.json(req.body);
      }
    });
	});
	
	//deletes work item
	app.delete('/work/:wI', function(req, res){
	  var sql = "DELETE FROM work WHERE work_id = ?$1";
	  var values = [req.params.wI];
	  pool.query(sql, values, (err, result) => {
	    if (err) {
        console.log(err.stack)
      } else {
        res.json(req.body);
      }
		});
	});
};