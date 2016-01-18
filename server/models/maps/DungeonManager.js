"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Q = require('q');

var Campaign = require(__dirname + '/../../../js/campaigns/Campaign');
var Dungeon = require(__dirname + '/../../../js/maps/Dungeon');

var CampaignManager = require(__dirname + '/../campaigns/CampaignManager');
var CharacterManager = require(__dirname + '/../creatures/CharacterManager');
var RoomManager = require(__dirname + '/RoomManager');

var DungeonManager = function () {

};

// returns a promise to an array of modules
DungeonManager.fetchByCampaign = function (user, campaignID) {

    return CampaignManager.fetchByID(user, campaignID)

        .then(function(campaign) {

            if (campaign.locationID == null)
            {
                logger.info('campaign locationID is null, so generating room');

                return [ campaign, 
                
                    RoomManager.create() 
                        .then(function(room) {
                            logger.info('Room was created successfully, so updating campaign locationID');
                            campaign.locationID = room._id;
                            return [ room, CampaignManager.update(campaign) ];
                        })
                        .spread(function(room, campaign) {
                            return room;
                        })
                        .catch(function(err) {
                            throw new Error(err);
                        })

                ];
            }
            else
            {
                logger.info('Campaign locationID was not null, so fetching room');
                return [ campaign, RoomManager.fetchByID(campaign.locationID) ];
            }
        })
        .spread(function(campaign, room) {
            return [ campaign, room, CharacterManager.fetchByCampaign(user, campaign) ];
        })
        .spread(function(campaign, room, party) {
            var dungeon = new Dungeon();
            dungeon.campaign = campaign;
            dungeon.room = room;
            dungeon.party = party;

            return dungeon;
        })
        .catch(function(err) {
            logger.error('Could not fetch dungeon for campaign ' + campaignID + ', userID: ' + user._id + ': ' + err);
            throw err;
        });

};




module.exports = DungeonManager;