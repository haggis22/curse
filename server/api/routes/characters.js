var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var PlayerManager = require('./../../managers/PlayerManager');

router.get('/', function (req, res) {

    var callback = function (err, characters) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(characters);
        }

    };

    PlayerManager.fetchAll(callback);

});

router.get('/:name', function (req, res) {

    var name = req.params.name;

    var player = PlayerManager.fetchByName(name);

    res.json(player);

});


module.exports = router;
