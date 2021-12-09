const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'developer.c8kdgbzcfl4l.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'developer_01',
  database: 'delicase',
  multipleStatements: true,
  acquireTimeout: 1000000
});

// const mysqlConnection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'delicase',
//   multipleStatements: true,
//   acquireTimeout: 1000000
// });

mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
});

module.exports = mysqlConnection;
