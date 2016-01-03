var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js_config.json', {});
var logger = log4js.getLogger('curse');

var Q = require('q');

var CampaignManager = require(__dirname + '/../../models/campaigns/CampaignManager');
var Campaign = require(__dirname + '/../../../js/campaigns/Campaign.js');


router.get('/modules', function (req, res) {

    CampaignManager.fetchModules(req.user, function(err, campaigns) { 

        if (err) {
            return res.status(500).send({ error: 'Could not fetch modules' }).end();
        }
        else {
            return res.json(campaigns);
        }
    
    });

});

// Copies an existing module to create a new campaign for it
router.post('/start/:moduleID', function (req, res) {

    CampaignManager.fetchModule(req.user, req.params.moduleID, function(err, module) {

        if (err) {
            return res.status(500).send({ error: 'Could not load module' }).end();
        }
        else if (module == null)
        {
            return res.status(400).send({ error: 'Unknown module' }).end();
        }

        // create a copy of the module for this user
        var campaign = new Campaign(module);
        
        // remove its ObjectID so that it gets a new one assigned
        delete campaign._id;

        // make the user the owner of the campaign
        campaign.userID = req.user._id;

        CampaignManager.create(req.user, campaign, function(err, newCampaign) {

            if (err)
            {
                return res.status(500).send({ error: 'Could not create campaign' }).end();
            }

            return res.json(newCampaign);


        });
   
    });

});


// adds a character to a campaign
router.post('/add/:campaignID/:characterID', function (req, res) {

    CampaignManager.join(req.user, req.params.campaignID, req.params.characterID, function(err, result) {

        if (err)
        {
            return res.status(500).send({ error: 'Could not join camapign' }).end();
        }

        return res.status(200).send(true);

    });

});


router.get('/', function (req, res) {

    CampaignManager.fetchAll(req.user, function(err, campaigns) { 

        if (err) {
            return res.status(500).send({ error: 'Could not fetch campaigns' }).end();
        }

        return res.json(campaigns);
    
    });

});

router.get('/:campaignID', function (req, res) {

    CampaignManager.fetchByID(req.user, req.params.campaignID)
        
        .then(function(campaign) {
            return res.json(campaign).end();
        })
        .catch(function(err) {
            return res.status(500).send({ error: 'Could not load campaign' }).end();
        });

});


router.put('/:campaignID', function (req, res) {

    var campaign = new Campaign(req.body);

    var callback = function (err, result) {

        if (err) {
            return res.status(500).json({ error: err }).end();
        }
        else {
            return res.json(result);
        }

    }

    CampaignManager.updateValues(req.user, campaign, callback);

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
