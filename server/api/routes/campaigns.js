var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var CampaignManager = require(__dirname + '/../../models/campaigns/CampaignManager');

router.get('/', function (req, res) {

    var callback = function (err, campaigns) {

        if (err) {
            return res.status(500).send(err).end();
        }
        else {
            return res.json(campaigns);
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

router.post('/', function (req, res) {

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

    CampaignManager.create(campaign, callback);

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

    CampaignManager.update(campaign, callback);

});

router.delete('/:campaignID', function (req, res) {

    var campaignID = req.params.campaignID;

    var callback = function (err, message) {

        if (err) {
            return res.status(500).json({ error: err }).end();
        }
        else {
            return res.json({ message: message });
        }

    }

    CampaignManager.delete(campaignID, callback);

});


module.exports = router;
