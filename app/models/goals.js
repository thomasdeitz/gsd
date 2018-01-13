module.exports = function(sequelize, Sequelize) {
 
    var goals = sequelize.define('Goals', {
 
        GoalId: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        GoalUrl: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        UserId: {
	        foreignKey: true,
            type: Sequelize.INTEGER
        }
    });
 
    return goals;
 
}