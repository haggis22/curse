var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var log4js = require('log4js');
log4js.configure(__dirname + '/log4js_config.json', {});
var logger = log4js.getLogger('curse');

var config = require('./config');

var app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    res.redirect('/curse.html');
});


app.use('/api', require('./api/routes/curseapi.js'));

app.use('/', express.static(__dirname + './../client'));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});


app.listen(config.port);
console.log('Listening on port ' + config.port + '...');