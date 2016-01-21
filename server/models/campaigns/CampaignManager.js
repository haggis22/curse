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
var RoomManager = require(__dirname + '/../maps/RoomManager.js');

var CampaignManager = function () {

};


// returns a promise to an array of modules
CampaignManager.fetchModules = function (user) {

    // we're not going to find any modules for a NULL user, so dump out now
    if (user == null)
    {
        return Q.resolve([]);
    }

    var deferred = Q.defer();

    var collection = db.get('campaigns');

    collection.find({ userID: Campaign.prototype.MODULE }, {}, function (err, result) {

        if (err) {
            logger.error('Could not load campaigns from database: ' + err);
            return deferred.reject(err);
        }

        // turn the array of results to an array of Campaigns (modules)
        return deferred.resolve(result.map(function(row) { return new Campaign(row); }));

    });

    return deferred.promise;

};

CampaignManager.fetchModule = function (id) {

    var deferred = Q.defer();

    var collection = db.get('campaigns');

    collection.find({ _id: id, userID: Campaign.prototype.MODULE }, function (err, result) {

        logger.info('error: ' + err + ', result: ' + result + ', isArray: ' + Array.isArray(result));

        if (err) {
            logger.error('Could not load module from database: ' + err);
            return deferred.reject(err);
        }

        if (result.length == 0) {

            // no error, but no module, either
            logger.warn('Could not find module with id ' + id);
            return deferred.resolve(null);
        }

        return deferred.resolve(new Campaign(result[0]));
    
    });

    return deferred.promise;

};


CampaignManager.startCampaign = function(user, moduleID) {

    return CampaignManager.fetchModule(moduleID)

        .then(function(module) {
            
            if (module == null)
            {
                return Q.resolve({ success: false, message: 'Could not find module ' + moduleID });
            }

            // create a copy of the module for this user
            var campaign = new Campaign(module);
        
            // remove its ObjectID so that it gets a new one assigned
            delete campaign._id;

            // make the user the owner of the campaign
            campaign.userID = user._id;

            // if the campaign has no starting point, then start it in the tavern 
            if (campaign.locationID == null)
            {
                campaign.locationID = RoomManager.prototype.ID_TAVERN;
            }

            return CampaignManager.create(campaign);

        });

};


CampaignManager.fetchAll = function (user) {

    var deferred = Q.defer();
    
    var collection = db.get('campaigns');

    collection.find({ userID: user._id }, {}, function (err, result) {

        if (err) {
            logger.error('Could not load campaigns from database: ' + err);
            return deferred.reject(err);
        }

        return deferred.resolve(result.map(function(row) { return new Campaign(row); }));

    });

    return deferred.promise;

};

// Fetches the campaign if the given user has access to it
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

        return deferred.resolve(new Campaign(result[0]));

    });

    return deferred.promise;




};


CampaignManager.create = function (campaign) {

    logger.debug('Inserting a new campaign: ' + campaign.name);

    var deferred = Q.defer();

    campaign.updated = new Date();

    var collection = db.get('campaigns');

    collection.insert(campaign, function (err, doc) {

        if (err) {
            logger.error('Could not create campaign: ' + err);
            return deferred.reject(err);
        }

        return deferred.resolve({ success: true });

    });

    return deferred.promise;


};



CampaignManager.update = function (campaign) {

    var deferred = Q.defer();

    try
    {
        campaign.updated = new Date();

        var collection = db.get('campaigns');

        collection.update({ _id: campaign._id }, campaign, function (err, doc) {

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


CampaignManager.join = function(user, campaignID, characterID) {

    // fetch the character and the campaign
    return Q.all([CharacterManager.fetchByID(user, characterID), CampaignManager.fetchByID(user, campaignID)])

        .spread(function(character, campaign) {

            return CharacterManager.joinCampaign(character, campaign);

        });

};

CampaignManager.quit = function(user, campaignID, characterID) {

    // fetch the character and the campaign
    return Q.all([CharacterManager.fetchByID(user, characterID), CampaignManager.fetchByID(user, campaignID)])

        .spread(function(character, campaign) {

            return CharacterManager.quitCampaign(character, campaign);
        });

};


module.exports = CampaignManager;