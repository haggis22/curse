var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var CampaignManager = require(__dirname + '/../../models/campaigns/CampaignManager');
var Campaign = require(__dirname + '/../../../js/campaigns/Campaign.js');


router.get('/', function (req, res) {

    CampaignManager.fetchAll(req.user, function(err, campaigns) { 

        if (err) {
            return res.status(500).send({ error: 'Could not fetch campaigns' }).end();
        }
        else {
            return res.json(campaigns);
        }
    
    });

});

router.get('/:campaignID', function (req, res) {

    CampaignManager.fetchByID(req.user, req.params.campaignID, function(err, campaign) {

        if (err) {
            return res.status(500).send({ error: 'Could not load campaign' }).end();
        }
        else if (campaign == null)
        {
            return res.status(400).send({ error: 'Unknown campaign' }).end();
        }

        return res.json(campaign).end();
   
    });

});

router.post('/', function (req, res) {

    var campaign = new Campaign(req.body);
    
    CampaignManager.create(req.user, campaign, function(err, campaign) {

        if (err) {
            return res.status(500).json({ error: 'Could not create campaign' }).end();
        }
        else {
            return res.json({ campaign: campaign });
        }
    
    });

});


router.put('/:campaignID', function (req, res) {

    var campaign = new Campaign(req.body);

    var callback = function (err, message) {

        if (err) {
            return res.status(500).json({ error: err }).end();
        }
        else {
            return res.json({ message: message });
        }

    }

    CampaignManager.update(req.user, campaign, callback);

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


router.put('/:campaignID/characters/:characterID', function(req, res) {

    CampaignManager.fetchByID(req.user, req.params.campaignID, function(errCampaign, campaign) {
    
        if (errCampaign)
        {
            return res.status(500).send({ error: 'Could not load campaign' }).end();
        }



    });
    


});


module.exports = router;
