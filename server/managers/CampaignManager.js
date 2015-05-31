"use strict";

var config = require('./../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Campaign = require('./../models/campaigns/Campaign.js');

var CampaignManager = function () {

};

CampaignManager.fetchAll = function (callback) {

    var collection = db.get('campaigns');

    var myCampaigns = [];

    collection.find({}, {}, function (err, result) {

        if (err) {
            logger.error('Could not load campaigns from database: ' + err);
            return callback(err, null);
        }

        for (var r = 0; r < result.length; r++) {
            myCampaigns.push(new Campaign(result[r]));
        }

        return callback(null, myCampaigns);
    });

};

CampaignManager.fetchByID = function (id, callback) {

    var collection = db.get('campaigns');

    collection.find({ _id: id }, function (err, result) {

        if (err) {
            logger.error('Could not load campaign from database: ' + err);
            return callback(err, null);
        }

        if (result.length == 0) {
            logger.error('Could not find record with id ' + id);
            return callback('Unknown ID ' + id, null);
        }

        return callback(null, new Campaign(result[0]));
    });

};


CampaignManager.create = function (campaign, callback) {

    var collection = db.get('campaigns');

    collection.insert(campaign, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not create campaign: ' + err);
            return callback(err, null);
        }

        console.info('campaign saved successfully');

        return callback(null, 'Campaign ' + campaign.id + ' saved successfully');

    });


};

CampaignManager.update = function (campaign, callback) {

    var collection = db.get('campaigns');

    collection.update({ _id: campaign.id }, campaign, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not update campaign: ' + err);
            return callback(err, null);
        }

        console.info('campaign saved successfully');

        return callback(null, 'Campaign ' + campaign.id + ' saved successfully');

    });


};


module.exports = CampaignManager;