var AdminModel = require('../models/admin.model');
var ServerModel = require('../models/server.model');
const config = require("../config/auth.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    admin = new AdminModel({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    admin.save();
    res.send({ message: "User was registered successfully!" });
};

exports.signin = (req, res) => {
    admin = new AdminModel();
    admin.find('first', { where: "username = '" + req.body.username + "'" }, function(err, row) {
        if (row.length == 0) {
            return res.status(404).send({ message: "User Not found." });
        } else {
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                row.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            var token = jwt.sign({ id: row.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            server = new ServerModel();
            server.find('all', function(err, rows) {
                if (rows.length == 0) {
                    res.status(200).send({
                        id: row.id,
                        username: row.username,
                        email: row.email,
                        server: 'noserver',
                        accessToken: token
                    });
                    return;
                } else {
                    res.status(200).send({
                        id: row.id,
                        username: row.username,
                        email: row.email,
                        server: rows[0].address,
                        accessToken: token
                    });
                    return;
                }
            });
        }
    });
};