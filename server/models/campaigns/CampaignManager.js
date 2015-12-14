"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Campaign = require(__dirname + '/../../../js/campaigns/Campaign.js');

var CampaignManager = function () {

};

CampaignManager.fetchAll = function (user, callback) {

    var collection = db.get('campaigns');

    collection.find({ userID: user._id }, {}, function (err, result) {

        if (err) {
            logger.error('Could not load campaigns from database: ' + err);
            return callback(err, null);
        }

        var myCampaigns = [];

        for (var r = 0; r < result.length; r++) {
            myCampaigns.push(new Campaign(result[r]));
        }

        return callback(null, myCampaigns);
    });

};

CampaignManager.fetchByID = function (user, id, callback) {

    var collection = db.get('campaigns');

    collection.find({ _id: id }, function (err, result) {

        if (err) {
            logger.error('Could not load campaign from database: ' + err);
            return callback(err, null);
        }

        if (result.length == 0) {

            // no error, but no campaign, either
            logger.warn('Could not find record with id ' + id);
            return callback(null, null);
        }

        var campaign = new Campaign(result[0]);

        debugger;

        if (!campaign.userID.equals(user._id)) {
            logger.error('Tried to access campaign ' + campaign._id + ' with the wrong user ' + user._id);
            return callback({ error: 'Not the owner' }, null);
        }

        return callback(null, campaign);
    });

};


CampaignManager.create = function (user, campaign, callback) {

    campaign = new Campaign(campaign);

    // create a new ID for the campaign
    campaign._id = '123456789012';

    // set the owner
    campaign.userID = user._id;

    campaign.updated = new Date();

    var collection = db.get('campaigns');

    collection.insert(campaign, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not create campaign: ' + err);
            return callback(err, null);
        }

        console.info('campaign saved successfully');

        var campaign = new Campaign(doc);

        return callback(null, campaign);

    });


};

CampaignManager.update = function (user, campaign, callback) {

    campaign.updated = new Date();

    var collection = db.get('campaigns');

    collection.update({ _id: campaign._id }, campaign, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not update campaign: ' + err);
            return callback(err, null);
        }

        console.info('campaign saved successfully');

        return callback(null, 'Campaign ' + campaign._id + ' saved successfully');

    });


};

CampaignManager.delete = function (campaignID, callback) {

    var collection = db.get('campaigns');

    collection.remove({ _id: campaignID }, { justOne: true }, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not delete campaign: ' + err);
            return callback(err, null);
        }

        console.info('campaign delete successfully');

        return callback(null, 'Campaign ' + campaignID + ' deleted successfully');

    });


};



module.exports = CampaignManager;