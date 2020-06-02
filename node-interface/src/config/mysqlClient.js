var mysql = require('mysql');
var config = require('./config.js')

module.exports = function(){
	var mysqldb = mysql.createPool(config.mysqldb);
	return mysqldb;
};