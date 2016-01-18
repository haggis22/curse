var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var Q = require('q');

var Campaign = require(__dirname + '/../../../js/campaigns/Campaign.js');
var Dungeon = require(__dirname + '/../../../js/dungeons/Dungeon.js');

var CampaignManager = require(__dirname + '/../../models/campaigns/CampaignManager');
var CharacterManager = require(__dirname + '/../../models/creatures/CharacterManager');


router.get('/:campaignID', function (req, res) {

    CampaignManager.fetchByID(req.user, req.params.campaignID)

        .then(function(campaign) {
            return [ campaign, CharacterManager.fetchByCampaign(req.user, campaign) ];
        })
        .spread(function(campaign, party) {
            var dungeon = new Dungeon();
            dungeon.campaign = campaign;
            dungeon.party = party;

            return res.json(dungeon);
        })
        .catch(function(err) {
            return res.status(500).send({ error: 'System error' }).end();
        });

});


module.exports = router;
