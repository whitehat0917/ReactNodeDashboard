var mysqlModel = require('mysql-model');
var db = require('../../config/database.js');

const connection = mysqlModel.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

var blacklistmaster = connection.extend({
    tableName: "BLACKLIST",
});
module.exports = blacklistmaster;