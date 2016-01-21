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

            // TODO: check location for being the tavern and send the user back there

            if (campaign.locationID == null)
            {
                // This returns an array with both:
                // 1. a campaign, since this one will have been updated to make the current location not null
                // 2. the new room
                return RoomManager.create(campaign, campaign.locationID);
            }
            else
            {
                return Q.all([ campaign, RoomManager.fetchByID(campaign, campaign.locationID) ]);
            }

        })
        .spread(function(campaign, room) {
            return Q.all([ campaign, room, CharacterManager.fetchByCampaign(user, campaign) ]);
        })
        .spread(function(campaign, room, party) {
            var dungeon = new Dungeon();
            dungeon.campaign = campaign;
            dungeon.room = room;
            dungeon.party = party;

            return dungeon;
        })
        .catch(function(err) {
            logger.error('Could not fetch dungeon for campaign ' + campaignID + ', userID: ' + user._id + '\n' + err.stack);
            throw err;
        });

};


DungeonManager.takeExit = function (user, campaignID, exitID) {

    logger.debug('In takeExit, campaignID: ' + campaignID + ', exitID: ' + exitID);

    return CampaignManager.fetchByID(user, campaignID)

        .then(function(campaign) {

            return Q.all([ campaign, RoomManager.fetchByID(campaign, campaign.locationID) ]);

        })
        .spread(function(campaign, room) {

            // TODO: Make sure the characters are allowed to leave right now - they might be in the middle of combat

            // make sure this room has this exit
            var exit = room.findExit(exitID);

            if (exit == null)
            {
                throw new Error('Room does not have the specified exit');
            }

            if (exit.destination == null)
            {

                // this will return an array of campaign and a new room. It will also create a path back to this room
                return Q.all([ room, exit, RoomManager.create(campaign, room._id) ])
                                
                        .spread(function(oldRoom, oldExit, createRoomResultArray) {

                            var campaign = createRoomResultArray[0];
                            var newRoom = createRoomResultArray[1];

                            // update the exit in the old room so that it points to the new room
                            oldExit.destination = newRoom._id;

                            return Q.all([ campaign, newRoom, RoomManager.update(oldRoom) ]);

                        })
                        .spread(function(campaign, newRoom, oldRoomUpdateResult) {
                            return [ campaign, newRoom ];
                        })
                        .catch(function(err) {

                            throw err;

                        });
            }

            // otherwise, fetch the existing room
            debugger;

            return Q.all([ campaign, RoomManager.fetchByID(campaign, exit.destination) ]);


        })
        .spread(function(campaign, nextRoom) {

            debugger;

            campaign.locationID = nextRoom._id;

            return CampaignManager.update(campaign);

        })
        .then(function(campaignUpdateResult) {
            return campaignUpdateResult;
        })
        .catch(function(err) {
            logger.error('Could not fetch dungeon for campaign ' + campaignID + ', userID: ' + user._id + '\n' + err.stack);
            throw err;
        });

};


module.exports = DungeonManager;