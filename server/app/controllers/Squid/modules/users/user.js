const requestIp = require('request-ip');
const request = require("request");
var IpSchema = require('../schema/ipmaster_schema');
var UserSchema = require('../schema/usermaster_schema');
var ProxySchema = require('../schema/proxymaster_schema');
var TempProxySchema = require('../schema/tempproxymaster_schema');
var HistorySchema = require('../schema/historymaster_schema');
var BlacklistSchema = require('../schema/blacklistmaster_schema');
var randomstring = require("randomstring");

module.exports.getDashboardData = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		user = new UserSchema();
		proxymaster = new ProxySchema();
		var responseData = {};
		ipmaster.query("select IFNULL(sum(amount), 0) as amount from history", function (err, rows, fields) {
			if (rows.length == 0) {
				responseData.total_price = 0;
			} else {
				responseData.total_price = rows[0].amount;
			}
			ipmaster.query('select sum(amount) amount, DATE_FORMAT(created_at,"%b") month from history where DATE_FORMAT(created_at,"%Y") = DATE_FORMAT(NOW(),"%Y") group by DATE_FORMAT(created_at, "%b") order by DATE_FORMAT(MAX(created_at), "%m")', function (err, rows, fields) {
				if (rows.length == 0) {
					responseData.price_list = 0;
				} else {
					responseData.price_list = rows[0].amount;
				}
				proxymaster.query("select IFNULL(count(*), 0) as count from PROXYMASTER", function (err, rows, fields) {
					if (rows.length != 0) {
						responseData.proxy_count = rows[0].count;
					} else {
						responseData.proxy_count = 0;
					}
					user.query("select IFNULL(count(*), 0) as count from USERMASTER", function (err, rows, fields) {
						if (rows.length != 0) {
							responseData.user_count = rows[0].count;
						} else {
							responseData.user_count = 0;
						}
						ipmaster.query("select sum(CAST(MUL AS SIGNED)-CAST(USED AS SIGNED)) as amount from IPMASTER", function (err, rows, fields) {
							if (rows.length != 0) {
								responseData.ip_count = rows[0].amount;
							} else {
								responseData.ip_count = 0;
							}
							res.status(200).json({ success: true, status: "No error", data: responseData });
							return;
						});
					});
				});
			});
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.addIp = async function (req, res) {
	try {
		const exec = require('child_process').exec;
		const testscript = exec('bash sh/addIp.sh ' + req.body.startIp + ' ' + req.body.count + ' ' + req.body.subnet);

		testscript.stdout.on('data', function (data) {
			console.log(data);
		});

		testscript.stderr.on('data', function (data) {
			console.log(data);
		});
		res.status(200).json({ success: true, status: "No error" });
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.showAvailableProxies = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		ipmaster.query("SELECT IPID, INET_NTOA(IPADDRESS) IPADDRESS, MUL-USED as FREE_IP, MUL, SUBNET FROM IPMASTER WHERE STATUS IS FALSE", function (err, rows, fields) {
			if (rows.length != 0) {
				let count = 0;
				Object.keys(rows).forEach(function (key) {
					var row = rows[key];
					count = count + parseInt(row.FREE_IP);
				});
				res.status(200).json({ success: true, status: "No error", data: { data: rows, amount: count, mul: rows[0].MUL } });
			} else {
				res.status(200).json({ success: true, status: "No data" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.addUser = async function (req, res) {
	try {
		usermaster = new UserSchema();
		usermaster.find('first', { where: "USERNAME = '" + req.body.username + "'" }, function (err, row) {
			if (row.length != 0) {
				res.status(200).json({ success: true, status: "User already exists!" });
			} else {
				usermaster = new UserSchema({
					username: req.body.username,
					password: req.body.password,
					type: "M",
				});
				usermaster.save();
				const exec = require('child_process').exec;
				const testscript = exec('bash sh/addUser.sh ' + req.body.username + ' ' + req.body.password);

				testscript.stdout.on('data', function (data) {
					console.log(data);
				});

				testscript.stderr.on('data', function (data) {
					console.log(data);
				});
				res.status(200).json({ success: true, status: "No error" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.setProxy = async function (req, res) {
	try {
		usermaster = new UserSchema();
		ipmaster = new IpSchema();
		proxymaster = new ProxySchema();
		usermaster.find('first', { where: "USERID = '" + req.body.userid + "'" }, function (err, row) {
			console.log(err);
			if (row.length == 0) {
				res.status(200).json({ success: true, status: "User doesn't exist!" });
			} else {
				let userid = row.USERID;
				let password = row.PASSWORD;
				let count = 0;
				ipmaster.query("SELECT IPMASTER.IPID, INET_NTOA(IPADDRESS) as IP FROM IPMASTER left join PROXYMASTER on IPMASTER.IPID = PROXYMASTER.IPID and PROXYMASTER.USERID = "+userid+" WHERE STATUS IS FALSE and PROXYMASTER.USERID is NULL ORDER BY USED", function (err, rows, fields) {
					if (rows.length == 0) {
						res.status(200).json({ success: true, status: "Ip doesn't exists!" });
					} else {
						count = rows.length;
						if (parseInt(req.body.count) > count) {
							res.status(200).json({ success: true, status: "Not enough available proxies to serve!" });
						} else {
							proxymaster.find('first', { where: "PORT = '" + req.body.port + "'" }, function (err, row1) {
								if (row1.length != 0) {
									res.status(200).json({ success: true, status: "Port already exist!" });
								} else {
									ipmaster.query("SELECT IPMASTER.IPID, INET_NTOA(IPADDRESS) as IP FROM IPMASTER left join PROXYMASTER on IPMASTER.IPID = PROXYMASTER.IPID and PROXYMASTER.USERID = "+userid+" WHERE STATUS IS FALSE and PROXYMASTER.USERID is NULL ORDER BY USED LIMIT " + parseInt(req.body.count), function (err, rows1, fields) {
										let data = [];
										for (let i = 0; i < rows1.length; i++) {
											data.push({ IP: rows1[i].IP, PORT: req.body.port, USERNAME: row.USERNAME, PASSWORD: password });
										}
										const exec = require('child_process').exec;
										const testscript = exec('bash sh/setProxy.sh ' + userid + ' ' + req.body.port + ' ' + row.USERNAME + ' ' + req.body.count + ' ' + req.body.days + ' ' + password + ' ' +userid);

										testscript.stdout.on('data', function (data) {
											console.log(data);
										});

										testscript.stderr.on('data', function (data) {
											console.log(data);
										});
										res.status(200).json({ success: true, status: "No error", data: data });
									});
								}
							});
						}
					}
				});
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.showExpire = async function (req, res) {
	try {
		usermaster = new UserSchema();
		ipmaster = new IpSchema();
		usermaster.find('first', { where: "USERNAME = '" + req.body.username + "'" }, function (err, row) {
			if (row.length != 0) {
				ipmaster.query("select INET_NTOA(IPADDRESS) as IP,EDATE FROM IPMASTER I INNER JOIN PROXYMASTER X ON X.IPID=I.IPID WHERE X.USERID=" + row.USERID, function (err, rows, fields) {
					if (rows.length > 0) {
						res.status(200).json({ success: true, status: "No error", data: rows });
					} else {
						res.status(200).json({ success: true, status: "No data" });
					}
				});
			} else {
				res.status(200).json({ success: true, status: "User doesn't exists!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.modifyExpire = async function (req, res) {
	try {
		usermaster = new UserSchema();
		ipmaster = new IpSchema();
		usermaster.find('first', { where: "USERNAME = '" + req.body.username + "'" }, function (err, row) {
			if (row.length != 0) {
				ipmaster.query("UPDATE PROXYMASTER SET EDATE='" + req.body.edate + "' WHERE USERID=" + row.USERID, function (err, rows, fields) {
					res.status(200).json({ success: true, status: "No error" });
				});
			} else {
				res.status(200).json({ success: true, status: "User doesn't exists!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.showUserProxy = async function (req, res) {
	try {
		usermaster = new UserSchema();
		ipmaster = new IpSchema();
		usermaster.find('first', { where: "USERID = '" + req.body.id + "'" }, function (err, row) {
			if (row.length != 0) {
				ipmaster.query("select PXYID as ID, INET_NTOA(IPADDRESS) as IP,PORT,USERNAME,PASSWORD,DATEDIFF(X.EDATE, X.SDATE) DAYS, EDATE FROM USERMASTER U inner join PROXYMASTER X on U.USERID=X.USERID inner join IPMASTER I on X.IPID=I.IPID where U.USERID=" + row.USERID, function (err, rows, fields) {
					res.status(200).json({ success: true, status: "No error", data: rows });
				});
			} else {
				res.status(200).json({ success: true, status: "User doesn't exists!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.deleteIp = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		ipmaster.find('first', { where: "IPADDRESS = INET_ATON('" + req.body.startIp + "')" }, function (err, row) {
			if (row.length != 0) {
				const exec = require('child_process').exec;
				const testscript = exec('bash sh/deleteIp.sh ' + req.body.startIp + ' ' + req.body.count + ' ' + req.body.subnet);

				testscript.stdout.on('data', function (data) {
					console.log(data);
				});

				testscript.stderr.on('data', function (data) {
					console.log(data);
				});
				res.status(200).json({ success: true, status: "No error" });
			} else {
				res.status(200).json({ success: true, status: "No IP!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.deleteProxy = async function (req, res) {
	try {
		usermaster = new UserSchema();
		proxymaster = new ProxySchema();
		usermaster.find('first', { where: "USERNAME = '" + req.body.username + "'" }, function (err, row) {
			if (row.length != 0) {
				let userid = row.USERID;
				proxymaster.find('all', { where: "USERID = " + userid }, function (err, rows) {
					for (let i = 0; i < rows.length; i++) {
						ipmaster.query("DELETE from PROXYMASTER WHERE IPID=" + rows[i].IPID + " and USERID=" + userid, function (err, rows, fields) { });
						ipmaster.query("UPDATE IPMASTER SET USED=USED-1 WHERE IPID=" + rows[i].IPID, function (err, rows, fields) { });
						ipmaster.query("UPDATE IPMASTER SET STATUS=0 WHERE IPID=" + rows[i].IPID, function (err, rows, fields) { });
					}
					const exec = require('child_process').exec;
					const testscript = exec('bash sh/deleteProxy.sh ' + userid);
					testscript.stdout.on('data', function (data) {
						console.log(data);
					});
					testscript.stderr.on('data', function (data) {
						console.log(data);
					});
					res.status(200).json({ success: true, status: "No error" });
				});
			} else {
				res.status(200).json({ success: true, status: "User doesn't exists!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.deleteUser = async function (req, res) {
	try {
		usermaster = new UserSchema();
		proxymaster = new ProxySchema();
		ipmaster = new IpSchema();
		usermaster.find('first', { where: "USERID = '" + req.body.userid + "'" }, function (err, row) {
			if (row.length != 0) {
				usermaster.remove("USERID = '" + req.body.userid + "'");
				proxymaster.find('all', { where: "USERID = " + row.USERID }, function (err, rows) {
					for (let i = 0; i < rows.length; i++) {
						ipmaster.query("DELETE from PROXYMASTER WHERE IPID=" + rows[i].IPID + " and USERID=" + req.body.userid, function (err, rows, fields) { });
						ipmaster.query("UPDATE IPMASTER SET USED=USED-1 WHERE IPID=" + rows[i].IPID, function (err, rows, fields) { });
						ipmaster.query("UPDATE IPMASTER SET STATUS=0 WHERE IPID=" + rows[i].IPID, function (err, rows, fields) { });
					}
				});

				const exec = require('child_process').exec;
				const testscript = exec('bash sh/deleteUser.sh ' + row.USERNAME + ' ' + row.USERID);
				testscript.stdout.on('data', function (data) {
					console.log(data);
				});
				testscript.stderr.on('data', function (data) {
					console.log(data);
				});
				res.status(200).json({ success: true, status: "No error" });
			} else {
				res.status(200).json({ success: true, status: "User doesn't exists!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.stopProxy = async function (req, res) {
	try {
		const exec = require('child_process').exec;
		const testscript = exec('bash sh/stopProxy.sh');
		testscript.stdout.on('data', function (data) {
			console.log(data);
		});
		testscript.stderr.on('data', function (data) {
			console.log(data);
		});
		res.status(200).json({ success: true, status: "No error" });
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.startProxy = async function (req, res) {
	try {
		const exec = require('child_process').exec;
		const testscript = exec('bash sh/startProxy.sh');
		testscript.stdout.on('data', function (data) {
			console.log(data);
		});
		testscript.stderr.on('data', function (data) {
			console.log(data);
		});
		res.status(200).json({ success: true, status: "No error" });
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.showProxies = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		ipmaster.query("select PXYID as ID, INET_NTOA(IPADDRESS) as IP,PORT,USERNAME,PASSWORD FROM USERMASTER U inner join PROXYMASTER X on U.USERID=X.USERID inner join IPMASTER I on X.IPID=I.IPID ORDER BY PXYID", function (err, rows, fields) {
			if (rows.length != 0) {
				res.status(200).json({ success: true, status: "No error", data: rows });
			} else {
				res.status(200).json({ success: true, status: "No data" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.addBlacklist = async function (req, res) {
	try {
		blacklist = new BlacklistSchema({
			url: req.body.url
		});
		blacklist.save();
		const exec = require('child_process').exec;
		const testscript = exec('bash sh/addBlacklist.sh ' + req.body.url);
		testscript.stdout.on('data', function (data) {
			console.log(data);
		});
		testscript.stderr.on('data', function (data) {
			console.log(data);
		});
		res.status(200).json({ success: true, status: "No error" });
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.editBlacklist = async function (req, res) {
	try {
		blacklist = new BlacklistSchema();

		blacklist.find('first', { where: "ID = '" + req.body.id + "'" }, function (err, row) {
			if (row.length != 0) {
				blacklist.set("URL", req.body.url);
				blacklist.save("ID = " + req.body.id);

				const exec = require('child_process').exec;
				const testscript = exec('bash sh/deleteBlacklist.sh ' + row.URL);
				testscript.stdout.on('data', function (data) {
					console.log(data);
				});
				testscript.stderr.on('data', function (data) {
					console.log(data);
				});

				const testscript1 = exec('bash sh/addBlacklist.sh ' + req.body.url);
				testscript1.stdout.on('data', function (data) {
					console.log(data);
				});
				testscript1.stderr.on('data', function (data) {
					console.log(data);
				});
				res.status(200).json({ success: true, status: "No error" });
			} else {
				res.status(200).json({ success: true, status: "Url doesn't exists!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.showBlacklist = async function (req, res) {
	try {
		blacklist = new BlacklistSchema();
		blacklist.find('all', function (err, rows) {
			if (rows.length != 0) {
				res.status(200).json({ success: true, status: "No error", data: rows });
			} else {
				res.status(200).json({ success: true, status: "No data" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.deleteBlacklist = async function (req, res) {
	try {
		blacklist = new BlacklistSchema();
		blacklist.remove("URL = '" + req.body.url + "'");
		const exec = require('child_process').exec;
		const testscript = exec('bash sh/deleteBlacklist.sh ' + req.body.url);
		testscript.stdout.on('data', function (data) {
			console.log(data);
		});
		testscript.stderr.on('data', function (data) {
			console.log(data);
		});
		res.status(200).json({ success: true, status: "No error" });
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.randomProxies = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		usermaster = new UserSchema();
		ipmaster.query("SELECT INET_NTOA(IPADDRESS),MUL-USED as FREE_IP FROM IPMASTER WHERE STATUS IS FALSE", function (err, rows, fields) {
			if (rows.length == 0) {
				res.status(200).json({ success: true, status: "Ip doesn't exists!" });
				return;
			} else {
				count = rows.length;
				if (parseInt(req.body.count) > count) {
					res.status(200).json({ success: true, status: "Not enough available proxies to serve!" });
					return;
				} else {
					let username = randomstring.generate({
						length: 6,
						capitalization: 'lowercase'
					});
					let password = randomstring.generate({
						length: 8,
						capitalization: 'lowercase'
					});
					let port = 0;
					while (port < 10000) {
						port = Math.floor(Math.random() * 16000) + 1;
					}
					usermaster.find('all', { where: "USERNAME = '" + username + "'" }, function (err, rows1) {
						if (rows1.length > 0)
							username = randomstring.generate({
								length: 7,
								capitalization: 'lowercase'
							});
						ipmaster.query("SELECT IPID, INET_NTOA(IPADDRESS) as IP, DATE_FORMAT(NOW() + INTERVAL " + parseInt(req.body.days) + " DAY, '%Y-%m-%d') as expire FROM IPMASTER WHERE STATUS IS FALSE ORDER BY USED LIMIT " + req.body.count, function (err, rows2, fields) {
							if (rows2.length != 0) {
								const exec = require('child_process').exec;
								const testscript = exec('bash sh/randomProxies.sh ' + req.body.count + ' ' + req.body.days + ' ' + username + ' ' + password + ' ' + port);
								testscript.stdout.on('data', function (data) {
									if (data != null) { }
								});
								testscript.stderr.on('data', function (data) {
									console.log(data);
								});
								let reply = [];
								for (let i = 0; i < rows2.length; i++) {
									reply.push(rows2[i].IP + ":" + port + ":" + username + ":" + password);
								}
								res.status(200).json({ success: true, status: "No error", data: reply });
							} else {
								res.status(200).json({ success: true, status: "No data" });
							}
						});
					});
				}
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.changeMulti = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		ipmaster.find('first', function (err, row) {
			if (row.length != 0) {
				let current = row.MUL;
				if (current > parseInt(req.body.count)) {
					res.status(200).json({ success: true, status: "Please Delete all proxies and then change the Multiplier Values" });
				} else if (parseInt(req.body.count) <= 0) {
					res.status(200).json({ success: true, status: "Please enter a value greater than 0" });
				} else {
					ipmaster.set("MUL", parseInt(req.body.count));
					ipmaster.set("STATUS", 0);
					ipmaster.save();
					res.status(200).json({ success: true, status: "No error" });
				}
			} else {
				res.status(200).json({ success: true, status: "Ip doesn't exists!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.deleteRandomProxy = async function (req, res) {
	try {
		const exec = require('child_process').exec;
		const testscript = exec('bash sh/deleteRandomProxy.sh');
		testscript.stdout.on('data', function (data) {
			console.log(data);
		});
		testscript.stderr.on('data', function (data) {
			console.log(data);
		});
		res.status(200).json({ success: true, status: "No error" });
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.getMulti = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		ipmaster.find('first', function (err, row) {
			if (row.length != 0) {
				res.status(200).json({ success: true, status: "No error", mul: row.MUL });
			} else {
				res.status(200).json({ success: true, status: "Ip doesn't exists!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.getUsers = async function (req, res) {
	try {
		user = new UserSchema();
		user.query("select *, (select count(*) from PROXYMASTER where USERID = USERMASTER.USERID) as PROXY_COUNT from USERMASTER", function (err, rows, fields) {
			res.status(200).json({ success: true, status: "No error", data: rows });
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.editProxy = async function (req, res) {
	try {
		if (req.body.type == true) {
			let query = "UPDATE PROXYMASTER SET PORT = " + parseInt(req.body.port) + ", EDATE = '" + req.body.sdate + "' + INTERVAL 1 DAY where PXYID = " + req.body.id
		} else {
			let query = "UPDATE PROXYMASTER SET PORT = " + parseInt(req.body.port) + ", EDATE = SDATE + INTERVAL " + parseInt(req.body.days) + " DAY where PXYID = " + req.body.id;
		}
		proxymaster = new ProxySchema();
		proxymaster.query(query, function (err, rows, fields) {
			if (err) {
				console.log(err);
				res.status(200).json({ success: true, status: "error" });
			} else {
				res.status(200).json({ success: true, status: "No error" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.deleteUserProxy = async function (req, res) {
	try {
		usermaster = new UserSchema();
		proxymaster = new ProxySchema();
		proxymaster.find('first', { where: "PXYID = " + req.body.id }, function (err, row) {
			let userid = row.USERID;

			proxymaster.query("DELETE from PROXYMASTER WHERE PXYID=" + req.body.id, function (err, rows, fields) { });
			proxymaster.query("UPDATE IPMASTER SET USED=USED-1 WHERE IPID=" + row.IPID, function (err, rows, fields) { });
			proxymaster.query("UPDATE IPMASTER SET STATUS=0 WHERE IPID=" + row.IPID, function (err, rows, fields) { });

			const exec = require('child_process').exec;
			const testscript = exec('bash sh/deleteProxy.sh ' + userid + ' ' + row.PORT);
			testscript.stdout.on('data', function (data) {
				console.log(data);
			});
			testscript.stderr.on('data', function (data) {
				console.log(data);
			});
			res.status(200).json({ success: true, status: "No error" });
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.checkExpire = async function (req, res) {
	try {
		usermaster = new UserSchema();
		proxymaster = new ProxySchema();
		proxymaster.find('all', { where: "EDATE < now()" }, function (err, rows) {
			if (rows.lenght == 0) {
				res.status(200).json({ success: true, status: "No error" });
				return;
			} else {
				for (let i = 0; i < rows.length; i++) {
					let row = rows[i];
					proxymaster.query("DELETE from PROXYMASTER WHERE PXYID=" + row.PXYID, function (err, rows, fields) { });
					proxymaster.query("UPDATE IPMASTER SET USED=USED-1 WHERE IPID=" + row.IPID, function (err, rows, fields) { });
					proxymaster.query("UPDATE IPMASTER SET STATUS=0 WHERE IPID=" + row.IPID, function (err, rows, fields) { });

					const exec = require('child_process').exec;
					const testscript = exec('bash sh/deleteProxy.sh ' + row.USERID + ' ' + row.PORT);
					testscript.stdout.on('data', function (data) {
						console.log(data);
					});
					testscript.stderr.on('data', function (data) {
						console.log(data);
					});
				}
			}
			usermaster.query('select USERID, USERNAME, (select count(*) from PROXYMASTER WHERE PROXYMASTER.USERID = USERMASTER.USERID) count from USERMASTER having count = 0;', function (err, rows, fields) {
				if (rows.length != 0) {
					for (let i = 0; i < rows.length; i++) {
						usermaster.remove("USERID = '" + rows[i].USERID + "'");
						const exec = require('child_process').exec;
						const testscript = exec('bash sh/deleteUser.sh ' + rows[i].USERNAME + ' ' + rows[i].USERID);
						testscript.stdout.on('data', function (data) {
							console.log(data);
						});
						testscript.stderr.on('data', function (data) {
							console.log(data);
						});
					}
				}
			});
			res.status(200).json({ success: true, status: "No error" });
			return;
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.getProxyHistory = async function (req, res) {
	try {
		historymaster = new HistorySchema();
		historymaster.find('all', function (err, rows) {
			if (rows.length != 0) {
				res.status(200).json({ success: true, status: "No error", data: rows });
			} else {
				res.status(200).json({ success: true, status: "No data" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.deleteUserAllProxy = async function (req, res) {
	try {
		usermaster = new UserSchema();
		proxymaster = new ProxySchema();
		let userid = req.body.id;
		proxymaster.find('all', { where: "USERID = " + userid }, function (err, rows) {
			for (let i = 0; i < rows.length; i++) {
				proxymaster.query("DELETE from PROXYMASTER WHERE PXYID=" + rows[i].PXYID, function (err, rows, fields) { });
				proxymaster.query("UPDATE IPMASTER SET USED=USED-1 WHERE IPID=" + rows[i].IPID, function (err, rows, fields) { });
				proxymaster.query("UPDATE IPMASTER SET STATUS=0 WHERE IPID=" + rows[i].IPID, function (err, rows, fields) { });

				const exec = require('child_process').exec;
				const testscript = exec('bash sh/deleteProxy.sh ' + userid + ' ' + rows[i].PORT);
				testscript.stdout.on('data', function (data) {
					console.log(data);
				});
				testscript.stderr.on('data', function (data) {
					console.log(data);
				});
			}
			res.status(200).json({ success: true, status: "No error" });
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.randomProxies = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		usermaster = new UserSchema();
		ipmaster.query("SELECT INET_NTOA(IPADDRESS),MUL-USED as FREE_IP FROM IPMASTER WHERE STATUS IS FALSE", function (err, rows, fields) {
			if (rows.length == 0) {
				res.status(200).json({ success: true, status: "Ip doesn't exists!" });
				return;
			} else {
				count = rows.length;
				if (parseInt(req.body.count) > count) {
					res.status(200).json({ success: true, status: "Not enough available proxies to serve!" });
					return;
				} else {
					let username = randomstring.generate({
						length: 6,
						capitalization: 'lowercase'
					});
					let password = randomstring.generate({
						length: 8,
						capitalization: 'lowercase'
					});
					let port = 0;
					while (port < 10000) {
						port = Math.floor(Math.random() * 16000) + 1;
					}
					usermaster.find('all', { where: "USERNAME = '" + username + "'" }, function (err, rows1) {
						if (rows1.length > 0)
							username = randomstring.generate({
								length: 7,
								capitalization: 'lowercase'
							});
						ipmaster.query("SELECT IPID, INET_NTOA(IPADDRESS) as IP, DATE_FORMAT(NOW() + INTERVAL " + parseInt(req.body.days) + " DAY, '%Y-%m-%d') as expire FROM IPMASTER WHERE STATUS IS FALSE ORDER BY USED LIMIT " + req.body.count, function (err, rows2, fields) {
							if (rows2.length != 0) {
								const exec = require('child_process').exec;
								const testscript = exec('bash sh/randomProxies.sh ' + req.body.count + ' ' + req.body.days + ' ' + username + ' ' + password + ' ' + port);
								testscript.stdout.on('data', function (data) {
									if (data != null) { }
								});
								testscript.stderr.on('data', function (data) {
									console.log(data);
								});
								let reply = [];
								for (let i = 0; i < rows2.length; i++) {
									reply.push(rows2[i].IP + ":" + port + ":" + username + ":" + password);
								}
								res.status(200).json({ success: true, status: "No error", data: reply });
							} else {
								res.status(200).json({ success: true, status: "No data" });
							}
						});
					});
				}
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.randomProxiesDate = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		usermaster = new UserSchema();
		ipmaster.query("SELECT INET_NTOA(IPADDRESS),MUL-USED as FREE_IP FROM IPMASTER WHERE STATUS IS FALSE", function (err, rows, fields) {
			if (rows.length == 0) {
				res.status(200).json({ success: true, status: "Ip doesn't exists!" });
				return;
			} else {
				count = rows.length;
				if (parseInt(req.body.count) > count) {
					res.status(200).json({ success: true, status: "Not enough available proxies to serve!" });
					return;
				} else {
					let username = randomstring.generate({
						length: 6,
						capitalization: 'lowercase'
					});
					let password = randomstring.generate({
						length: 8,
						capitalization: 'lowercase'
					});
					let port = 0;
					while (port < 10000) {
						port = Math.floor(Math.random() * 16000) + 1;
					}
					usermaster.find('all', { where: "USERNAME = '" + username + "'" }, function (err, rows1) {
						if (rows1.length > 0)
							username = randomstring.generate({
								length: 7,
								capitalization: 'lowercase'
							});
						ipmaster.query("SELECT IPID, INET_NTOA(IPADDRESS) as IP, DATE_FORMAT('" + req.body.sdate + "' + INTERVAL 1 DAY, '%Y-%m-%d') as edate FROM IPMASTER WHERE STATUS IS FALSE ORDER BY USED LIMIT " + req.body.count, function (err, rows2, fields) {
							if (rows2.length != 0) {
								usermaster = new UserSchema({
									username: username,
									password: password,
									type: "R",
								});
								usermaster.save(function (err, row, fields) {
									let reply = [];
									let groupId = Math.floor(Math.random() * 100000) + 1;
									for (let i = 0; i < rows2.length; i++) {
										reply.push(rows2[i].IP + ":" + port + ":" + username + ":" + password);
										proxymaster = new ProxySchema({
											USERID: row.USERID,
											IPID: rows2[i].IPID,
											PORT: port,
											SDATE: req.body.sdate,
											STIME: '00:00:00',
											EDATE: rows2[i].edate,
											ETIME: '00:00:00'
										});
										proxymaster.save(function (err, row1, fields) {
											tempproxymaster = new TempProxySchema({
												PXYID: row1.insertId,
												SDATE: req.body.sdate,
												GROUPID: groupId
											});
											tempproxymaster.save();
										});
										ipmaster.query("UPDATE IPMASTER SET USED=USED+1 WHERE IPID=" + rows2[i].IPID);
										ipmaster.query("UPDATE IPMASTER SET STATUS=1 WHERE IPID=" + rows2[i].IPID + " AND MUL=USED");
									}
									res.status(200).json({ success: true, status: "No error", data: reply });
								});
							} else {
								res.status(200).json({ success: true, status: "No data" });
							}
						});
					});
				}
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.setProxyByDate = async function (req, res) {
	try {
		let nz_date_string = new Date().toLocaleString("en-US", { timeZone: "Europe/Athens" });
		let date_nz = new Date(nz_date_string);
		let year = date_nz.getFullYear();
		let month = ("0" + (date_nz.getMonth() + 1)).slice(-2);
		let date = ("0" + date_nz.getDate()).slice(-2);

		tempproxymaster = new TempProxySchema();
		tempproxymaster.find('all', { where: "SDATE = '" + year + "-" + month + "-" + date + "'", group: "GROUPID" }, function (err, rows) {
			for (let i = 0; i < rows.length; i++) {
				tempproxymaster.query("select b.USERID, a.GROUPID, c.USERNAME, c.PASSWORD, b.PORT from TEMP_PROXYMASTER a left join PROXYMASTER b ON a.PXYID = b.PXYID left join USERMASTER c ON b.USERID = c.USERID where b.PXYID = " + rows[i].PXYID, function (err, rows1, fields) {
					const exec = require('child_process').exec;
					const testscript = exec('bash sh/randomProxiesDate.sh ' + rows1[0].USERID + ' ' + rows1[0].GROUPID + ' ' + rows1[0].USERNAME + ' ' + rows1[0].PASSWORD + ' ' + rows1[0].PORT);
					testscript.stdout.on('data', function (data) {
						if (data != null) { }
					});
					testscript.stderr.on('data', function (data) {
						console.log(data);
					});
				});
			}
		});
		res.status(200).json({ success: true, status: "No error" });
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.setProxyDate = async function (req, res) {
	try {
		usermaster = new UserSchema();
		ipmaster = new IpSchema();
		proxymaster = new ProxySchema();
		usermaster.find('first', { where: "USERID = '" + req.body.userid + "'" }, function (err, row) {
			console.log(err);
			if (row.length == 0) {
				res.status(200).json({ success: true, status: "User doesn't exist!" });
			} else {
				let userid = row.USERID;
				let password = row.PASSWORD;
				let count = 0;
				ipmaster.query("SELECT IPMASTER.IPID, INET_NTOA(IPADDRESS) as IP FROM IPMASTER left join PROXYMASTER on IPMASTER.IPID = PROXYMASTER.IPID and PROXYMASTER.USERID = "+userid+" WHERE STATUS IS FALSE and PROXYMASTER.USERID is NULL ORDER BY USED", function (err, rows, fields) {
					if (rows.length == 0) {
						res.status(200).json({ success: true, status: "Ip doesn't exists!" });
					} else {
						count = rows.length;
						if (parseInt(req.body.count) > count) {
							res.status(200).json({ success: true, status: "Not enough available proxies to serve!" });
						} else {
							proxymaster.find('first', { where: "PORT = '" + req.body.port + "'" }, function (err, row1) {
								if (row1.length != 0) {
									res.status(200).json({ success: true, status: "Port already exist!" });
								} else {
									ipmaster.query("SELECT IPMASTER.IPID, INET_NTOA(IPADDRESS) as IP, DATE_FORMAT('" + req.body.sdate + "' + INTERVAL 1 DAY, '%Y-%m-%d') as edate FROM IPMASTER left join PROXYMASTER on IPMASTER.IPID = PROXYMASTER.IPID and PROXYMASTER.USERID = "+userid+" WHERE STATUS IS FALSE and PROXYMASTER.USERID is NULL ORDER BY USED LIMIT " + parseInt(req.body.count), function (err, rows1, fields) {
										let reply = [];
										let groupId = Math.floor(Math.random() * 100000) + 1;
										for (let i = 0; i < rows1.length; i++) {
											reply.push({ IP: rows1[i].IP, PORT: req.body.port, USERNAME: row.USERNAME, PASSWORD: password });
											proxymaster = new ProxySchema({
												USERID: row.USERID,
												IPID: rows1[i].IPID,
												PORT: req.body.port,
												SDATE: req.body.sdate,
												STIME: '00:00:00',
												EDATE: rows1[i].edate,
												ETIME: '00:00:00'
											});
											proxymaster.save(function (err, row2, fields) {
												tempproxymaster = new TempProxySchema({
													PXYID: row2.insertId,
													SDATE: req.body.sdate,
													GROUPID: groupId
												});
												tempproxymaster.save();
											});
											ipmaster.query("UPDATE IPMASTER SET USED=USED+1 WHERE IPID=" + rows1[i].IPID);
											ipmaster.query("UPDATE IPMASTER SET STATUS=1 WHERE IPID=" + rows1[i].IPID + " AND MUL=USED");
										}
										res.status(200).json({ success: true, status: "No error", data: reply });
									});
								}
							});
						}
					}
				});
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.deleteAllIp = async function (req, res) {
	try {
		ipmaster = new IpSchema();
		ipmaster.find('all', function (err, row) {
			if (row.length != 0) {
				const exec = require('child_process').exec;
				const testscript = exec('bash sh/deleteAllIp.sh');

				testscript.stdout.on('data', function (data) {
					console.log(data);
				});

				testscript.stderr.on('data', function (data) {
					console.log(data);
				});
				res.status(200).json({ success: true, status: "No error" });
			} else {
				res.status(200).json({ success: true, status: "No IP!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}

module.exports.setUserNotes = async function (req, res) {
	try {
		usermaster = new UserSchema();
		usermaster.find('first', { where: "USERID = '" + req.body.userid + "'" }, function (err, row) {
			if (row.length != 0) {
				usermaster.set("NOTES", req.body.notes);
				usermaster.save("USERID = " + req.body.userid);
				res.status(200).json({ success: true, status: "No error" });
			} else {
				res.status(200).json({ success: true, status: "User doesn't exists!" });
			}
		});
	} catch (error) {
		console.log("userController-401", error);
		res.status(401).json({ success: false, error: error });
	}
}