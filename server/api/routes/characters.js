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

    CharacterManager.create(req.user, character)

        .then(function(character) {
            return res.json(character);
        })
        .catch(function(err) {
            return res.status(500).json({ error: err }).end();
        });            

});



// re-rolls an existing character
router.post('/rollup/:characterID', function (req, res) {

    CharacterManager.reroll(req.user, req.params.characterID)
        .then(function(result) {
            return res.json(result);
        })
        .catch(function(err) {
            logger.error('Could not re-roll character', err);
            return res.status(500).json({ error: 'Could not re-roll character' }).end();
        });

});


// fetches a given character from the database
router.get('/:characterID', function (req, res) {

    CharacterManager.fetchByID(req.user, req.params.characterID)
        
        .then(function(character) {
            return res.json(character).end();
        })
        .catch(function(err) {
            return res.status(500).send({ error: 'Could not load character' }).end();
        });


});


// deletes the specified character from the database permanently
router.delete('/:characterID', function (req, res) {

    CharacterManager.delete(req.user, req.params.characterID)

        .then(function(result) {
            return res.json(result);
        })
        .catch(function(err) {
            logger.error('Could not delete character', err);
            return res.status(500).json({ error: 'Could not delete character' }).end();
        });

});



// validates and saves the stat changes requested by the client
router.post('/:characterID/stats', function (req, res) {

    var characterID = req.params.characterID;
    var character = req.body;

    CharacterManager.saveStats(req.user, character)
        .then(function(result) {
            return res.json(result);
        })
        .catch(function(err) { 
            return res.status(500).json({ error: 'Could not save stats' }).end();
        });

});


// validates and saves the stat changes requested by the client
router.post('/:characterID/skills', function (req, res) {

    var characterID = req.params.characterID;
    var character = req.body;

    CharacterManager.saveSkills(req.user, character)
        .then(function(result) {
            return res.json(result);
        })
        .catch(function(err) { 
            return res.status(500).json({ error: 'Could not save skills' }).end();
        });

});


module.exports = router;
