var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');


var DungeonManager = require(__dirname + '/../../models/maps/DungeonManager');

router.get('/:campaignID', function (req, res) {

    DungeonManager.fetchByCampaign(req.user, req.params.campaignID)

        .then(function(dungeon) {
            return res.json(dungeon);
        })
        .catch(function(err) {
            return res.status(500).send({ error: 'System error' }).end();
        });

});

router.post('/exit/:campaignID/:exitID', function (req, res) {

    DungeonManager.takeExit(req.user, req.params.campaignID, req.params.exitID)

        .then(function(result) {
            // logger.debug('Returning result ' + JSON.stringify(result));
            return res.json(result);
        })
        .catch(function(err) {
            return res.status(500).send({ error: 'System error' }).end();
        });

});

router.post('/items/take/:campaignID/:characterID/:itemID', function (req, res) {

    DungeonManager.pickUp(req.user, req.params.campaignID, req.params.characterID, req.params.itemID)

        .then(function(result) {
            // logger.debug('Returning result ' + JSON.stringify(result));
            return res.json(result);
        })
        .catch(function(err) {
            return res.status(500).send({ error: 'System error' }).end();
        });

});


module.exports = router;
