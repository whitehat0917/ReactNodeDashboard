const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", controller.allAccess);
    app.post(
        "/api/test/getDashboardData", [authJwt.verifyToken],
        controller.getDashboardData
    );
    app.get(
        "/api/test/admin", [authJwt.verifyToken],
        controller.adminBoard
    );
    app.post(
        "/api/test/getAvailableIpList", [authJwt.verifyToken],
        controller.getAvailableIpList
    );
    app.post(
        "/api/test/addIp", [authJwt.verifyToken],
        controller.addIp
    );
    app.post(
        "/api/test/deleteIp", [authJwt.verifyToken],
        controller.deleteIp
    );
    app.post(
        "/api/test/getProxyHistory", [authJwt.verifyToken],
        controller.getProxyHistory
    );
    app.post(
        "/api/test/setMaxIp", [authJwt.verifyToken],
        controller.setMaxIp
    );
    app.post(
        "/api/test/getUsedProxy", [authJwt.verifyToken],
        controller.getUsedProxy
    );
    app.post(
        "/api/test/getUsers", [authJwt.verifyToken],
        controller.getUsers
    );
    app.post(
        "/api/test/getUserProxy", [authJwt.verifyToken],
        controller.getUserProxy
    );
    app.post(
        "/api/test/addUserProxy", [authJwt.verifyToken],
        controller.addUserProxy
    );
    app.post(
        "/api/test/editUserProxy", [authJwt.verifyToken],
        controller.editUserProxy
    );
    app.post(
        "/api/test/deleteUserProxy", [authJwt.verifyToken],
        controller.deleteUserProxy
    );
    app.post(
        "/api/test/addUser", [authJwt.verifyToken],
        controller.addUser
    );
    app.post(
        "/api/test/deleteUser", [authJwt.verifyToken],
        controller.deleteUser
    );
    app.post(
        "/api/test/getBlacklist", [authJwt.verifyToken],
        controller.getBlacklist
    );
    app.post(
        "/api/test/addBlacklist", [authJwt.verifyToken],
        controller.addBlacklist
    );
    app.post(
        "/api/test/editBlacklist", [authJwt.verifyToken],
        controller.editBlacklist
    );
    app.post(
        "/api/test/deleteBlacklist", [authJwt.verifyToken],
        controller.deleteBlacklist
    );
    app.post(
        "/api/test/getServers", [authJwt.verifyToken],
        controller.getServers
    );
    app.post(
        "/api/test/deleteServer", [authJwt.verifyToken],
        controller.deleteServer
    );
    app.post(
        "/api/test/addServer", [authJwt.verifyToken],
        controller.addServer
    );
    app.post(
        "/api/test/editServer", [authJwt.verifyToken],
        controller.editServer
    );
    app.get("/api/test/downloadFile", controller.downloadFile);
    app.post(
        "/api/test/deleteUserAllProxy", [authJwt.verifyToken],
        controller.deleteUserAllProxy
    );
    app.post(
        "/api/test/deleteAllIp", [authJwt.verifyToken],
        controller.deleteAllIp
    );
    app.post(
        "/api/test/setUserNotes", [authJwt.verifyToken],
        controller.setUserNotes
    );
};