var ServerModel = require('../models/server.model');
const request = require("request");
const fs = require('fs');
var os = require('os');

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.getDashboardData = (req, res) => {
    var responseData = {};
    responseData.proxy_count = 0;
    responseData.user_count = 0;
    responseData.ip_count = 0;
    responseData.total_price = 0;
    responseData.price_list = [];
    const url = "http://" + req.body.server + ":80/api/users/getDashboardData";
    request.post(url, (error, response, body) => {
        if (error != null) {
            res.status(200).send({ status: "error", data: responseData });
            return;
        }
        if (JSON.parse(body).status == "No error") {
            const data = JSON.parse(body).data;
            responseData.proxy_count = data.proxy_count;
            responseData.user_count = data.user_count;
            responseData.ip_count = data.ip_count;
            responseData.total_price = data.total_price;
            responseData.price_list = data.price_list;
        }
        res.status(200).send({ status: "success", data: responseData });
        return;
    });
};

exports.getAvailableIpList = (req, res) => {
    const url = "http://" + req.body.server + ":80/api/users/showAvailableProxies";
    request.post(url, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (JSON.parse(body).status == "No data") {
            res.status(200).send({ status: "nodata" });
        } else {
            const data = JSON.parse(body).data;
            res.status(200).send({ status: "success", data: data });
        }
    });
};

exports.addIp = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/addIp',
        json: true,
        body: {
            startIp: req.body.startIp,
            count: req.body.count,
            subnet: req.body.subnet
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        }
    });
};

exports.deleteIp = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/deleteIp',
        json: true,
        body: {
            startIp: req.body.startIp,
            count: req.body.count,
            subnet: req.body.subnet
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        }
    });
};

exports.getProxyHistory = (req, res) => {
    const url = "http://" + req.body.server + ":80/api/users/getProxyHistory";
    request.post(url, (error, response, body) => {
        if (error != null) {
            res.status(200).send({ status: "error" });
            return;
        }
        if (JSON.parse(body).status == "No data") {
            res.status(200).send({ status: "nodata" });
        } else {
            const data = JSON.parse(body).data;
            res.status(200).send({ status: "success", data: data });
        }
    });
};

exports.setMaxIp = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/changeMulti',
        json: true,
        body: {
            count: req.body.count
        }
    };
    request.post(options, (error, response, body) => {
        console.log(body.status);
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.getUsedProxy = (req, res) => {
    const url = "http://" + req.body.server + ":80/api/users/showProxies";
    request.post(url, (error, response, body) => {
        if (error != null) {
            res.status(200).send({ status: "error" });
            return;
        }
        if (JSON.parse(body).status == "No data") {
            res.status(200).send({ status: "nodata" });
        } else if (JSON.parse(body).status == "No error") {
            const data = JSON.parse(body).data;
            res.status(200).send({ status: "success", data: data });
        }
    });
};

exports.getUsers = (req, res) => {
    const url = "http://" + req.body.server + ":80/api/users/getUsers";
    request.post(url, (error, response, body) => {
        if (error != null) {
            res.status(200).send({ status: "error" });
            return;
        }
        if (JSON.parse(body).status == "No error") {
            const data = JSON.parse(body).data;
            res.status(200).send({ status: "success", data: data });
        } else {
            res.status(200).send({ status: JSON.parse(body).status });
        }
    });
};

exports.getUserProxy = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/showUserProxy',
        json: true,
        body: {
            id: req.body.userid
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success", data: body.data });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.addUserProxy = (req, res) => {
    let options = {};
    if (req.body.type == true) {
        options = {
            url: 'http://' + req.body.server + ':80/api/users/setProxyDate',
            json: true,
            body: {
                userid: req.body.userid,
                port: req.body.port,
                count: req.body.count,
                days: req.body.days,
                sdate: req.body.sdate
            }
        };
    } else {
        options = {
            url: 'http://' + req.body.server + ':80/api/users/setProxy',
            json: true,
            body: {
                userid: req.body.userid,
                port: req.body.port,
                count: req.body.count,
                days: req.body.days
            }
        };
    }
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "Squid server error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.editUserProxy = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/editProxy',
        json: true,
        body: {
            id: req.body.id,
            port: req.body.port,
            days: req.body.days,
            type: req.body.type,
            sdate: req.body.sdate
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.deleteUserProxy = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/deleteUserProxy',
        json: true,
        body: {
            id: req.body.id,
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.addUser = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/addUser',
        json: true,
        body: {
            username: req.body.username,
            password: req.body.password
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.deleteUser = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/deleteUser',
        json: true,
        body: {
            userid: req.body.userid
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.getBlacklist = (req, res) => {
    const url = "http://" + req.body.server + ":80/api/users/showBlacklist";
    request.post(url, (error, response, body) => {
        if (error != null) {
            res.status(200).send({ status: "error" });
            return;
        }
        if (JSON.parse(body).status == "No error") {
            const data = JSON.parse(body).data;
            res.status(200).send({ status: "success", data: data });
        } else {
            res.status(200).send({
                status: JSON.parse(body).status,
                data: []
            });
        }
    });
};

exports.addBlacklist = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/addBlacklist',
        json: true,
        body: {
            url: req.body.url
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.editBlacklist = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/editBlacklist',
        json: true,
        body: {
            id: req.body.id,
            url: req.body.url
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.deleteBlacklist = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/deleteBlacklist',
        json: true,
        body: {
            url: req.body.url
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.getServers = (req, res) => {
    server = new ServerModel();
    server.find('all', function(err, rows) {
        if (err) {
            return res.status(200).send({ status: "Database Error" });
        } else {
            return res.status(200).send({ status: "success", data: rows });
        }
    });
};

exports.deleteServer = (req, res) => {
    server = new ServerModel();
    server.remove("id = '" + req.body.id + "'");
    res.status(200).send({ status: "success" });
    return;
};

exports.addServer = (req, res) => {
    var path, NodeSSH, ssh, fs;

    fs = require('fs');
    path = require('path');
    NodeSSH = require('node-ssh');
    ssh = new NodeSSH();
    const password = req.body.password;

    ssh.connect({
        host: req.body.address,
        username: 'root',
        password: password
    }).then(function() {
        ssh.mkdir('/home/Squid').then(function(Contents) {
            console.log("The File's contents were successfully downloaded");
            const failed = [];
            const successful = [];
            ssh.putDirectory(__dirname + '/Squid', '/home/Squid', {
                recursive: true,
                concurrency: 10,
                validate: function(itemPath) {
                    const baseName = path.basename(itemPath)
                    return baseName.substr(0, 1) !== '.' && // do not allow dot files
                        baseName !== 'node_modules' // do not allow node_modules
                },
                tick: function(localPath, remotePath, error) {
                    if (error) {
                        failed.push(localPath)
                    } else {
                        successful.push(localPath)
                    }
                }
            }).then(function(status) {
                console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
                if (status == true) {
                    // ssh.execCommand("sed -i 's/\r//' netplan.sh", { cwd: '/home/Squid/sh' }).then(function(result) {
                    // console.log('STDOUT: ' + result.stdout);
                    // console.log('STDERR: ' + result.stderr);
                    ssh.execCommand('sudo npm install', { cwd: '/home/Squid' }).then(function(result) {
                            console.log('STDOUT: ' + result.stdout);
                            console.log('STDERR: ' + result.stderr);
                            ssh.execCommand('pm2 start app.js', { cwd: '/home/Squid' }).then(function(result) {
                                console.log('STDOUT: ' + result.stdout);
                                console.log('STDERR: ' + result.stderr);
                            })
                            server = new ServerModel({
                                address: req.body.address,
                                password: req.body.password,
                                tag: req.body.tag
                            });
                            server.save();
                            res.status(200).send({ status: "success" });
                            return;
                        }, function(error) {
                            console.log("Something's wrong");
                            console.log(error);
                            res.status(200).send({ status: "Something is wrong!" });
                            return;
                        })
                        // })
                } else {
                    res.status(200).send({ status: "Something is wrong. Please try again later!" });
                    return;
                }
            })
        }, function(error) {
            console.log("Something's wrong");
            console.log(error);
            res.status(200).send({ status: "Please enter password for root user!" });
            return;
        })
    }).catch(err => {
        ssh.connect({
            host: req.body.address,
            username: 'root',
            password: password
        }).then(function() {
            ssh.mkdir('/home/Squid').then(function(Contents) {
                console.log("The File's contents were successfully downloaded");
                const failed = [];
                const successful = [];
                ssh.putDirectory(__dirname + '/Squid', '/home/Squid', {
                    recursive: true,
                    concurrency: 10,
                    validate: function(itemPath) {
                        const baseName = path.basename(itemPath)
                        return baseName.substr(0, 1) !== '.' && // do not allow dot files
                            baseName !== 'node_modules' // do not allow node_modules
                    },
                    tick: function(localPath, remotePath, error) {
                        if (error) {
                            failed.push(localPath)
                        } else {
                            successful.push(localPath)
                        }
                    }
                }).then(function(status) {
                    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
                    if (status == true) {
                        // ssh.execCommand("sed -i 's/\r//' netplan.sh", { cwd: '/home/Squid/sh' }).then(function(result) {
                        // console.log('STDOUT: ' + result.stdout);
                        // console.log('STDERR: ' + result.stderr);
                        ssh.execCommand('sudo npm install', { cwd: '/home/Squid' }).then(function(result) {
                                console.log('STDOUT: ' + result.stdout);
                                console.log('STDERR: ' + result.stderr);
                                ssh.execCommand('pm2 start app.js', { cwd: '/home/Squid' }).then(function(result) {
                                    console.log('STDOUT: ' + result.stdout);
                                    console.log('STDERR: ' + result.stderr);
                                })
                                server = new ServerModel({
                                    address: req.body.address,
                                    password: req.body.password,
                                    tag: req.body.tag
                                });
                                server.save();
                                res.status(200).send({ status: "success" });
                                return;
                            }, function(error) {
                                console.log("Something's wrong");
                                console.log(error);
                                res.status(200).send({ status: "Something is wrong!" });
                                return;
                            })
                            // })
                    } else {
                        res.status(200).send({ status: "Something is wrong. Please try again later!" });
                        return;
                    }
                })
            }, function(error) {
                console.log("Something's wrong");
                console.log(error);
                res.status(200).send({ status: "Please enter password for root user!" });
                return;
            })
        }).catch(err => {
            res.status(200).send({ status: "Please enter correct server info!" });
            return;
        });
    });
};

exports.editServer = (req, res) => {
    server.set("address", req.body.address);
    server.set("password", req.body.password);
    server.set("tag", req.body.tag);
    server.save("id = " + req.body.id);
    res.status(200).send({ status: "success" });
    return;
};

exports.downloadFile = (req, res) => {
    const options = {
        url: 'http://' + req.query.server + ':80/api/users/showUserProxy',
        json: true,
        body: {
            id: req.query.userid
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "Squid server error" });
            return;
        }
        if (body.status == "No error") {
            let currentTime = new Date().getTime();
            let reply = '';
            for (let i = 0; i < body.data.length; i++) {
                reply = reply + body.data[i].IP + ":" + body.data[i].PORT + ":" + body.data[i].USERNAME + ":" + body.data[i].PASSWORD + os.EOL;
            }
            fs.writeFile('attachment/' + currentTime + '.txt', reply, function(err) {
                if (err) return console.log(err);
                res.download('attachment/' + currentTime + '.txt');
                return;
            });
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.deleteUserAllProxy = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/deleteUserAllProxy',
        json: true,
        body: {
            id: req.body.id,
        }
    };
    request.post(options, (error, response, body) => {
        console.log(body);
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};

exports.deleteAllIp = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/deleteAllIp',
        json: true,
        body: {}
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        }
    });
};

exports.setUserNotes = (req, res) => {
    const options = {
        url: 'http://' + req.body.server + ':80/api/users/setUserNotes',
        json: true,
        body: {
            userid: req.body.userid,
            notes: req.body.notes
        }
    };
    request.post(options, (error, response, body) => {
        if (error != null) {
            console.log(error);
            res.status(200).send({ status: "error" });
            return;
        }
        if (body.status == "No error") {
            res.status(200).send({ status: "success" });
            return;
        } else {
            res.status(200).send({ status: body.status });
            return;
        }
    });
};