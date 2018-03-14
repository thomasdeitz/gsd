const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Client, Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://thomasd4_test:test1@localhost:5432/thomasd4_gp';

/*{
  user: 'thomasd4_blanku',
  host: 'localhost',
  database: 'thomasd4_blankpg',
  password: 'blank1',
  port: 5432
};
thomasd4_test:test1@localhost:5432/thomasd4_gp*/

const pool = new Pool({
  connectionString: connectionString,
  //ssl: true
});

module.exports = function(app) {

  /*pool.query("CREATE TABLE worker (worker_id serial PRIMARY KEY, worker_name text NOT NULL, gender integer NOT NULL)", (err, result) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log('worker table created')
	  }
  });*/

    //gets all workers
    app.get('/workers', function(req, res) {
        pool.query("SELECT worker_name AS name, worker.worker_id AS id, gender, SUM(work.work_value) AS total, COUNT(work) AS count FROM work INNER JOIN worker ON work.worker_id = worker.worker_id WHERE work_status = 1 GROUP BY worker.worker_name, worker.worker_id, gender ORDER BY COUNT(work) DESC;", (err, result) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log(result.rows);
            res.render('workers', { workers: result.rows })
    		  }
        });
    });

    app.get('/workers/:worker_id', function(req, res) {
        var getWorkerWork = "SELECT * FROM work INNER JOIN worker ON worker.worker_id = work.worker_id WHERE work.worker_id = $1 AND work_status = 1;";
        var values = [req.params.worker_id];
        
        pool.query(getWorkerWork, values, function(err, results) {
            if (err) {
              console.log(err.stack)
            } else {
              var rows = results.rows;
              var data = {}
              data.name = rows[0].worker_name;
              data.count = rows.length;
              data.total = rows.reduce((total, rows) => { return total + rows.work_value},0);
              data.workList = results.rows;
              console.log(data);
              res.render('worker', { worker: data });
            }
        });

    });
    
  //adds new worker
	app.post('/worker', jsonParser, function(req, res){
		var addWorker = "INSERT INTO worker (worker_name, gender) VALUES $1";
		var values = [req.body.worker, req.body.gender];

		pool.query(addWorker, [values], function (err, result) {
		    if (err) {
          console.log(err.stack)
        } else {
          res.json(req.body);
        }
		  });
	});
};