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

DungeonManager.moveToRoom = function(campaign, roomID)
{
    return RoomManager.fetchByID(campaign, roomID)
        
        .then(function(room) {

            campaign.locationID = room._id;

            return Q.all([ room, CampaignManager.update(campaign) ]);

        })
        .spread(function(room, campaignUpdateResult) {

            return Q.resolve(room);

        })
};

DungeonManager.createStartRoom = function(campaign, currentLocationID) {

    return RoomManager.create(campaign, currentLocationID)

        .then(function(newRoom) {

            campaign.startLocationID = newRoom._id;
            return Q.all([ newRoom, CampaignManager.update(campaign) ]);

        })
        .spread(function(newRoom, campaignUpdateResult) {

            return newRoom;

        });

};


// returns a promise to an array of modules
DungeonManager.fetchByCampaign = function (user, campaignID) {

    return CampaignManager.fetchByID(user, campaignID)

        .then(function(campaign) {

            if (campaign.locationID == RoomManager.ID_TAVERN)
            {
                // move them from the tavern to the start location
                if (campaign.startLocationID)
                {
                    return Q.all([ campaign, DungeonManager.moveToRoom(campaign, campaign.startLocationID) ]);
                }

                // we need to create a starting room and then move to it
                return DungeonManager.createStartRoom(campaign, campaign.startLocationID)
                    
                    .then(function(newRoom) { 

                        return Q.all([ campaign, DungeonManager.moveToRoom(campaign, newRoom._id) ]);

                    });

            }   // end if in the tavern

            // othwerwise just return the room they're in
            return Q.all([ campaign, RoomManager.fetchByID(campaign, campaign.locationID) ]);

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
            console.log('here X');
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
                                
                        .spread(function(oldRoom, oldExit, newRoom) {

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