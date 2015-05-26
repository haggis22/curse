var express = require('express');

var characters = require('./routes/characters.js');
var path = require('path');

var app = express();

const PORT = 8080;

app.use('/', express.static(__dirname + './../client'));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});

app.get('/characters', characters.findAll);
app.get('/characters/:name', characters.findByName);

app.get('/', function(req, res) {
    res.sendFile('curse.html', { root: __dirname + '/client' });
});

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');