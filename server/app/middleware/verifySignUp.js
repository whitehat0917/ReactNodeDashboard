var AdminModel = require('../models/admin.model');

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    admin = new AdminModel();
    admin.find('first', { where: "username = '" + req.body.username + "'" }, function(err, row) {
        if (row.length != 0) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        } else {
            admin.find('first', { where: "email = '" + req.body.email + "'" }, function(err, row) {
                if (row.length != 0) {
                    res.status(400).send({
                        message: "Failed! Email is already in use!"
                    });
                    return;
                } else {
                    next();
                }
            });
        }
    });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;