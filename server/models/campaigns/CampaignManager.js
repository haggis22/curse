﻿"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Q = require('q');

var Campaign = require(__dirname + '/../../../js/campaigns/Campaign.js');
var CharacterManager = require(__dirname + '/../creatures/CharacterManager.js');


var CampaignManager = function () {

};

CampaignManager.fetchModules = function (user, callback) {

    var collection = db.get('campaigns');

    collection.find({ userID: Campaign.prototype.MODULE }, {}, function (err, result) {

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

CampaignManager.fetchModule = function (user, id, callback) {

    var collection = db.get('campaigns');

    collection.find({ _id: id, userID: Campaign.prototype.MODULE }, function (err, result) {

        if (err) {
            logger.error('Could not load module from database: ' + err);
            return callback(err, null);
        }

        if (result.length == 0) {

            // no error, but no module, either
            logger.warn('Could not find module with id ' + id);
            return callback(null, null);
        }

        var module = new Campaign(result[0]);

        return callback(null, module);
    });

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

CampaignManager.fetchByID = function (user, id) {

    var collection = db.get('campaigns');

    var deferred = Q.defer();

    collection.find({ _id: id, userID: user._id }, function(err, result) {

        if (err)
        {
            return deferred.reject(new Error(err));
        }

        if (result.length !== 1)
        {
            return deferred.reject(new Error('Campaign not found'));
        }

        var campaign = new Campaign(result[0]);

        if (campaign.characters.length == 0)
        {
            return deferred.resolve(campaign);
        }

        var charArray = campaign.characters.map(function(charID) {

            return CharacterManager.fetchByIDPromise(user, charID);

        });


        Q.all(charArray)
            .then(function(data) {
                campaign.charArray = data;
                deferred.resolve(campaign);
            });


    });

    return deferred.promise;




};


CampaignManager.create = function (user, campaign, callback) {

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

CampaignManager.updateValues = function (user, campaign, callback) {

    // first, validate that the campaign's adjustments are legal
    // We need to pull the existing campaign
    CampaignManager.fetchByID(user, campaign._id, function (err, oldCampaign) {

        if (err) {
            // it failed - return an error
            logger.error('Could not verify campaign update: ' + err);
            return callback(err, null);
        }

        if (oldCampaign == null)
        {
            logger.warn('Could not verify campaign with id ' + campaign._id + ' for user ' + user._id);
            return callback(new Error('Could not verify campaign owner'), null);
        }

        var newValues = { name: campaign.name };

        return CampaignManager.update(campaign._id, newValues, function(updateErr, result) {

            if (err)
            {
                logger.err('Could not update campaign: ' + err);
                return callback(err, null);
            }

            if (result)
            {
                return callback(null, campaign);
            }

            return callback(new Error('Save campaign failed'), null);

        });

    });


};


CampaignManager.update = function (campaignID, newValues, callback) {

    newValues.updated = new Date();

    var collection = db.get('campaigns');

    collection.update({ _id: campaignID }, { $set: newValues }, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not update campaign: ' + err);
            return callback(err, false);
        }

        return callback(null, true);

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


CampaignManager.join = function(user, campaignID, characterID, callback) {

    CampaignManager.fetchByID(user, campaignID, function(err, campaign) {

        if (err) {
            return callback(err, false);
        }

        // add the character to this campaign
        CharacterManager.joinCampaign(user, characterID, campaign._id, function(joinErr, character) {

            if (joinErr)
            {
                return callback(joinErr, false);
            }

            // update the campaign to include this character
            campaign.characters.push(character._id);

            CampaignManager.update(campaignID, { characters: campaign.characters }, function(saveErr, result) {

                if (saveErr)
                {
                    return callback(saveErr, false);
                }

                return callback(null, true);

            });   // CampaignManager.join

        });  // CharacterManager.join

    });

};


module.exports = CampaignManager;