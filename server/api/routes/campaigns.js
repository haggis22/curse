var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var CampaignManager = require('./../../managers/CampaignManager');

router.get('/', function (req, res) {

    var callback = function (err, characters) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(characters);
        }

    };

    CampaignManager.fetchAll(callback);

});

router.get('/:campaignID', function (req, res) {

    var campaignID = req.params.campaignID;

    var callback = function (err, campaign) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(campaign).end();
        }

    };

    CampaignManager.fetchByID(campaignID, callback);

});


router.put('/:campaignID', function (req, res) {

    var campaignID = req.params.campaignID;
    var campaign = req.body;
    campaign.updated = new Date();

    var callback = function (err, message) {

        if (err) {
            return res.status(500).json({ error: err }).end();
        }
        else {
            return res.json({ message: message });
        }

    }

    CampaignManager.save(campaign, callback);

});

/*
router.get('/:name', function (req, res) {

    var name = req.params.name;

    var player = PlayerManager.fetchByName(name);

    res.json(player);

});
*/

module.exports = router;
