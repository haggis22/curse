var express = require('express');
var wines = require('./routes/wines.js');
var path = require('path');

var app = express();

const PORT = 8080;

app.use('/', express.static(__dirname + './../client'));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});

app.get('/wines', wines.findAll);
app.get('/wines/:id', wines.findById);

/*
app.get('/', function(req, res) {
    res.sendFile('curse.html', { root: __dirname + '/client' });
});
*/

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');