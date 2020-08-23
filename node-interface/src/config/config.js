//配置mysql数据库
module.exports = {
	// mysqldb: {
	// 	connectionLimit: 10000,
	// 	connectTimeout  : 60 * 60 * 1000,
	//  	aquireTimeout   : 60 * 60 * 1000,
	// 	timeout         : 60 * 60 * 1000,
	// 	host: 'mysqlFR',
	// 	user: 'root',
	// 	//port     : 3306,
	// 	password: 'dp2015',
	// 	database: 'web-flash',
	// 	autoReconnect: true
	// },

	// mysqldb: {
	// 	connectionLimit: 10000,
	// 	connectTimeout  : 60 * 60 * 1000,
	//  	aquireTimeout   : 60 * 60 * 1000,
	// 	timeout         : 60 * 60 * 1000,
	// 	host: '10.1.10.35',
	// 	user: 'root',
	// 	//port     : 3306,
	// 	password: 'dp2015',
	// 	database: 'web-flash',
	// 	autoReconnect: true
	// },

	mysqldb: {
		connectionLimit: 1000,
		connectTimeout  : 60 * 60 * 1000,
	 	aquireTimeout   : 60 * 60 * 1000,
		timeout         : 60 * 60 * 1000,
		host: '127.0.0.1',
		user: 'root',
		port: 3306,
		password: 'dp2015',
		database: 'web-flash'
	}
}