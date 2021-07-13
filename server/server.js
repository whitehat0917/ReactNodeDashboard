const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');
const https = require('https');
const path = require('path');

const app = express();

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(express.static(__dirname + "/build"));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
});

// cron.schedule("59 23 * * *", function() {
//     const url = "http://" + config.squidAddress + "/api/users/checkExpire";
//     request.post(url, (error, response, body) => {
//         return;
//     });
// });

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// const key = fs.readFileSync('./server.key');
// const cert = fs.readFileSync('./server.cert');
// set port, listen for requests
const PORT = process.env.PORT || 8443;
// https.createServer({ key: key, cert: cert }, app).listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}.`);
// });
app.listen(8080, () => {
    console.log(`Server is running on port ${PORT}.`);
});