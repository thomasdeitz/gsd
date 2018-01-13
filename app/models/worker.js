module.exports = function(sequelize, Sequelize) {
 
    var Worker = sequelize.define('worker', {
 
        WorkderId: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        WorkerName: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        WorkerGender: {
            type: Sequelize.ENUM('female', 'male')
        }
    },
    {
	    timestamps: false,
	    tableName: "Worker2"
    });
 
    return Worker;
 
}