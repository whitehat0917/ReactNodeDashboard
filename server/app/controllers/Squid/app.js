const express = require('express');
const path = require('path');
const session = require('express-session')
var cors = require('cors')

const Users = require('./modules/users/router.js');

// require('./config/passport.js');

var bodyParser = require('body-parser');
const app = express();
var cookieParser = require('cookie-parser');

app.use(cors())

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', Users);
// app.use('/api/competitions', Competitions);

// error handlers`
// Catch unauthorised errors
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({ "message": err.name + ": " + err.message });
    }
});

// web server 8080
app.listen(8080, () => console.log('-- [ BLACJACK NODE ] SERVER STARTED LISTENING ON PORT 8080 --'));