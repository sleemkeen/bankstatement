var mysql = require('mysql');
require ('custom-env').env('staging')

var db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  socketPath : process.env.MYSQL_SOCKET,
  connectionLimit: 10,
  supportBigNumbers: true
});


module.exports = db;

