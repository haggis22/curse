var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var log4js = require('log4js');
log4js.configure(__dirname + '/server/log4js_config.json', {});
var logger = log4js.getLogger('curse');

var config = require(__dirname + '/server/config');

var app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', function (req, res) {
    res.redirect('/curse.html');
});


app.use('/api', require(__dirname + '/server/api/routes/curseapi.js'));

// app.use('/', express.static(__dirname + './../client'));

app.use('/js', express.static(__dirname + '/js'));

app.use('/', express.static(__dirname + '/client'));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});


app.listen(config.port);
logger.info('Listening on port ' + config.port + '...');