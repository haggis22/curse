var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var CharacterManager = require('./../../managers/CharacterManager');


router.post('/rollup/:characterID', function (req, res) {

    var characterID = req.params.characterID;

    var callback = function (err, character) {

        if (err) {
            return res.status(500).json({ error: err }).end();
        }
        else {
            return res.json(character);
        }

    }

    CharacterManager.reroll(characterID, callback);

});


router.get('/', function (req, res) {

    var callback = function (err, characters) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(characters);
        }

    };

    CharacterManager.fetchAll(callback);

});

router.get('/:characterID', function (req, res) {

    var characterID = req.params.characterID;

    var callback = function (err, character) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(character).end();
        }

    };

    CharacterManager.fetchByID(characterID, callback);

});

router.post('/', function (req, res) {

    var character = req.body;

    var callback = function (err, result) {

        if (err) {
            return res.status(500).json({ error: err }).end();
        }
        else {
            return res.json(result);
        }

    }

    CharacterManager.create(character, callback);

});


router.put('/:characterID', function (req, res) {

    var characterID = req.params.characterID;
    var request = req.body;
    var character = request.character;
    var adjustment = request.adjustment;

    var callback = function (err, character) {

        if (err) {
            return res.status(500).json({ error: err.message }).end();
        }
        else {
            return res.json({ character: character });
        }

    }

    CharacterManager.update(character, adjustment, callback);

});

module.exports = router;
