const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Client, Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || {
  user: 'thomasd4_blanku',
  host: 'localhost',
  database: 'thomasd4_blankpg',
  password: 'blank1',
  port: 5432
};

const pool = new Pool(connectionString);

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
        pool.query("SELECT worker_name LIMIT 1 AS name, worker_id AS id FROM worker", (err, result) => {
          if (err) {
            console.log(err.stack)
          } else {
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