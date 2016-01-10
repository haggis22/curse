"use strict";

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

        // the campaign has no characters, so just dump out
        if (campaign.characters.length == 0)
        {
            return deferred.resolve(campaign);
        }

        // this converts the array of string characterIDs to an array of promises
        var charArray = campaign.characters.map(function(charID) {

            return CharacterManager.fetchByID(user, charID);

        });

        // once all the promises are resolved then we put them in a special array in the campaign and resolve it
        Q.all(charArray)
            .then(function(data) {
                campaign.charArray = data;
                deferred.resolve(campaign);
            })
            .catch(function(err) {
                deferred.reject(new Error(err));
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



CampaignManager.update = function (campaignID, campaign) {

    var deferred = Q.defer();

    try
    {
        campaign.updated = new Date();

        var collection = db.get('campaigns');

        collection.update({ _id: campaignID }, campaign, function (err, doc) {

            if (err) {
                // it failed - return an error
                logger.error('Could not update campaign: ' + err);
                deferred.reject(new Error(err));
            }

            deferred.resolve(true);

        });
    }
    catch (err) 
    {
        logger.error('Error in update: ' + err);
        deferred.reject(new Error(err));
    }

    return deferred.promise;


};

CampaignManager.delete = function (campaignID) {

    var deferred = Q.defer();

    try
    {

        var collection = db.get('campaigns');

        collection.remove({ _id: campaignID }, { justOne: true }, function (err, doc) {

            if (err) {
                // it failed - return an error
                logger.error('Could not delete campaign: ' + err);
                return deferred.reject(new Error(err));
            }

            return deferred.resolve(true);

        });

    }
    catch (err) 
    {
        logger.error('Error in delete: ' + err);
        deferred.reject(new Error(err));
    }

    return deferred.promise;


};


CampaignManager.join = function(user, campaignID, characterID, callback) {

    // fetch the character and the campaign
    return Q.all([CharacterManager.fetchByID(user, characterID), CampaignManager.fetchByID(user, campaignID)])

        .spread(function(character, campaign) {

            var updatePromises = [];

            // add the character to the campaign
            campaign.characters.push(character._id);
            
            return Q.all([ CampaignManager.update(campaign._id, campaign), CharacterManager.joinCampaign(character, campaign) ])

                .then(function(results) {

                    return true;

                });

        })

};

CampaignManager.quit = function(user, campaignID, characterID, callback) {

    // fetch the character and the campaign
    return Q.all([CharacterManager.fetchByID(user, characterID), CampaignManager.fetchByID(user, campaignID)])

        .spread(function(character, campaign) {

            var updatePromises = [];

            // remove the character from the array of characters in the campaign
            var newCharacters = [];
            for (var c=0; c < campaign.characters.length; c++)
            {
                if (campaign.characters[c].toString() != character._id.toString())
                {
                    newCharacters.push(campaign.characters[c]);
                }
            }

            campaign.characters = newCharacters;

            return Q.all([ CampaignManager.update(campaign._id, campaign), CharacterManager.quitCampaign(character, campaign) ])

                .then(function(results) {

                    return true;

                });

        })

};


module.exports = CampaignManager;