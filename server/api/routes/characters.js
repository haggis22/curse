var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var CharacterManager = require(__dirname + '/../../models/creatures/CharacterManager');

var Owl = require(__dirname + '/../../../client/js/test/owl.js');


// returns all characters for the given user
router.get('/', function (req, res) {

    CharacterManager.fetchByUser(req.user, function (err, characters) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(characters);
        }

    });


});

// Creates a brand-new character
router.post('/', function (req, res) {

    var character = req.body;

    CharacterManager.create(req.user, character, function (err, character) {

        if (err) {
            return res.status(500).json({ error: err }).end();
        }
        else {
            return res.json(character);
        }

    });


});



// re-rolls an existing character
router.post('/rollup/:characterID', function (req, res) {

    CharacterManager.reroll(req.user, req.params.characterID, function (err, result) {

        if (err) {

            logger.error('Could not re-roll character', err);
            return res.status(500).json({ error: 'Could not re-roll character' }).end();
        }
        else {

            return res.json(result);
        }

    });

});


// fetches a given character from the database
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

    CharacterManager.fetchByID(req.user, characterID, callback);

});


// deletes the specified character from the database permanently
router.delete('/:characterID', function (req, res) {

    CharacterManager.delete(req.user, req.params.characterID, function (err, result) {

        if (err) {

            logger.error('Could not delete character', err);
            return res.status(500).json({ error: 'Could not delete character' }).end();
        }
        else {

            return res.json(result);
        }

    });

});



// validates and saves the stat changes requested by the client
router.post('/:characterID/stats', function (req, res) {

    var characterID = req.params.characterID;
    var character = req.body;

    var callback = function (err, character) {

        if (err) {
            logger.error('Could not save stats', err);
            return res.status(500).json({ error: 'System error' }).end();
        }
        else {
            return res.json({ character: character });
        }

    }

    CharacterManager.saveStats(req.user, character, callback);

});

// validates and saves the stat changes requested by the client
router.post('/:characterID/skills', function (req, res) {

    var characterID = req.params.characterID;
    var character = req.body;

    var callback = function (err, character) {

        if (err) {
            logger.error('Could not save skills', err);
            return res.status(500).json({ error: 'System error' }).end();
        }
        else {
            return res.json({ character: character });
        }

    }

    CharacterManager.saveSkills(req.user, character, callback);

});


module.exports = router;
