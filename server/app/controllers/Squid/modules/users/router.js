var express = require('express');
var router = express.Router();

var _user = require('./user.js');

router.use(function timeLog(req, res, next) {
    next();
});

router.post('/addIp', _user.addIp);
router.post('/showAvailableProxies', _user.showAvailableProxies);
router.post('/addUser', _user.addUser);
router.post('/setProxy', _user.setProxy);
router.post('/showExpire', _user.showExpire);
router.post('/modifyExpire', _user.modifyExpire);
router.post('/showUserProxy', _user.showUserProxy);
router.post('/deleteIp', _user.deleteIp);
router.post('/deleteUserProxy', _user.deleteUserProxy);
router.post('/deleteUser', _user.deleteUser);
router.post('/stopProxy', _user.stopProxy);
router.post('/startProxy', _user.startProxy);
router.post('/showProxies', _user.showProxies);
router.post('/addBlacklist', _user.addBlacklist);
router.post('/showBlacklist', _user.showBlacklist);
router.post('/deleteBlacklist', _user.deleteBlacklist);
router.post('/randomProxies', _user.randomProxies);
router.post('/changeMulti', _user.changeMulti);
router.post('/deleteRandomProxy', _user.deleteRandomProxy);
router.post('/getMulti', _user.getMulti);
router.post('/getUsers', _user.getUsers);
router.post('/editProxy', _user.editProxy);
router.post('/deleteProxy', _user.deleteProxy);
router.post('/editBlacklist', _user.editBlacklist);
router.post('/getDashboardData', _user.getDashboardData);
router.post('/checkExpire', _user.checkExpire);
router.post('/getProxyHistory', _user.getProxyHistory);
router.post('/deleteUserAllProxy', _user.deleteUserAllProxy);
router.post('/randomProxiesDate', _user.randomProxiesDate);
router.post('/setProxyByDate', _user.setProxyByDate);
router.post('/setProxyDate', _user.setProxyDate);
router.post('/deleteAllIp', _user.deleteAllIp);
router.post('/setUserNotes', _user.setUserNotes);

module.exports = router;