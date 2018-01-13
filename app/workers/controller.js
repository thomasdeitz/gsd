var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mysql = require('mysql2');
var config = require('../../config');
var con = mysql.createConnection(config.database);

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
};