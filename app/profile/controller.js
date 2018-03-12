var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mysql = require('mysql2');
var config = require('../../config');
var con = mysql.createConnection(config.database);

con.connect();

module.exports = function(app) {
    app.get('/user/:Id/profile', function(req, res) {
        var sql = "SELECT * FROM users WHERE id = ?";
        
        var id = req.params.Id;
        
        con.query(sql, [id], function(err, results, fields) {
            if (err) throw err;
            var data = results[0];
            res.render('profile', {
                user: data
            });
        });

    });
};