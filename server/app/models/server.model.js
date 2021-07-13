var mysqlModel = require('mysql-model');
var db = require('../config/db.config');

const connection = mysqlModel.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

var server = connection.extend({
    tableName: "servers",
});
module.exports = server;