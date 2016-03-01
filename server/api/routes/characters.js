var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var CharacterManager = require(__dirname + '/../../models/creatures/CharacterManager');
var CampaignManager = require(__dirname + '/../../models/campaigns/CampaignManager');


// returns all characters for the given user
router.get('/', function (req, res) {

    CharacterManager.fetchByUser(req.user)

        .then(function(characters) {
            return res.json(characters);
        })
        .catch(function(err) {
            return res.status(500).send({ error: 'System error' }).end();
        });

});

// returns all characters for the given user's campaign
router.get('/campaign/:campaignID', function (req, res) {

    CampaignManager.fetchByID(req.user, req.params.campaignID)

        .then(function(campaign) {

            return CharacterManager.fetchPartyByCampaign(req.user, campaign);
        })
        .then(function(characters) {
            return res.json(characters);
        })
        .catch(function(err) {
            return res.status(500).send({ error: 'System error' }).end();
        });

});


// Creates a brand-new character
router.post('/', function (req, res) {

    // the character is posted in the body of the request
    CharacterManager.create(req.user, req.body)

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

    // the character is posted in the body of the request
    CharacterManager.saveStats(req.user, req.body)

        .then(function(result) {
            return res.json(result);
        })
        .catch(function(err) { 
            return res.status(500).json({ error: 'Could not save stats' }).end();
        });

});


// validates and saves the stat changes requested by the client
router.post('/:characterID/skills', function (req, res) {

    // the character is posted in the body of the request
    CharacterManager.saveSkills(req.user, req.body)

        .then(function(result) {
            return res.json(result);
        })
        .catch(function(err) { 
            return res.status(500).json({ error: 'Could not save skills' }).end();
        });

});


module.exports = router;
