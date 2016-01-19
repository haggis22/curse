﻿"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');
var ObjectID = require('mongodb').ObjectID;

var db = monk(config.db);

var Q = require('q');

var dice = require(__dirname + '/../../core/Dice');

var Exit = require(__dirname + '/../../../js/maps/Exit');
var Room = require(__dirname + '/../../../js/maps/Room');

var ItemFactory = require(__dirname + '/../../../js/items/ItemFactory');

var CampaignManager = require(__dirname + '/../campaigns/CampaignManager');


var RoomManager = function () {

};

var rooms = 
[
	{ name: 'library', prep: 'in a', frequency: 1 },
	{ name: 'guardroom', prep: 'in a', frequency: 2 },
	{ name: 'bedroom', prep: 'in a', frequency: 2 },
	{ name: 'cave', prep: 'in a', frequency: 2 },
    { name: 'chapel', prep: 'in a', frequency: 1 },
    { name: 'stone chamber', prep: 'in a', frequency: 1 },
    { name: 'hall', prep: 'in a', frequency: 2 },
    { name: 'room with several tapestries hanging from the walls', prep: 'in a' , frequency: 0.5},
    { name: 'dining room', prep: 'in a' , frequency: 2}
];


// Returns a promise to a room
RoomManager.fetchByID = function (campaign, roomID) {

    var deferred = Q.defer();

    var collection = db.get('rooms');

    collection.find({ _id: roomID, campaignID: campaign._id }, function (err, result) {

        if (err) {
            logger.error('Could not load room from database: ' + err);
            deferred.reject(err);
        }

        var room = new Room(result[0]);
        deferred.resolve(room);

    });

    return deferred.promise;

};     // fetchByID


function randomExit()
{
    var rnd = Math.random();
    if (rnd < 0.3)
    {
        return 'a door';
    }
    if (rnd < 0.5)
    {
        return 'a doorway';
    }
    if (rnd < 0.7)
    {
        return 'a hallway';
    }
    if (rnd < 0.8)
    {
        return 'a passage';
    }
    if (rnd < 0.9)
    {
        return 'a hall';
    }
                
    return 'an exit';
    
}

RoomManager.rollRoom = function(campaign)
{
    var room = new Room(dice.randomElement(rooms));
    room.campaignID = campaign._id;

    var numExits = dice.rollDie(1,2);

    for (var x=0; x < numExits; x++)
    {
        var exit = new Exit();
        // since an exit is not a primary key, it will not get an automatic ID assigned to it, so 
        // create on manually so that we can refer to it when taking an exit
        exit._id = new ObjectID();
        exit.name = randomExit();
        exit.destination = null;
        room.exits.push(exit);
    }

    return Q.resolve([ campaign, room ]);
}

RoomManager.create = function (campaign) {

    return RoomManager.rollRoom(campaign)

        .spread(function(campaign, room) {

            var deferred = Q.defer();

            room.updated = new Date();

            var collection = db.get('rooms');

            collection.insert(room, function (err, doc) {

                if (err) {
                    // it failed - return an error
                    logger.error('Could not create room: ' + err);
                    return deferred.reject(new Error(err));
                }

                // return the newly-created room
                return deferred.resolve(new Room(doc));

            });  // collection.insert

            return Q.all([ campaign, deferred.promise ]);

        })
        .spread(function(campaign, room) {
    
            logger.info('Room was created successfully, so updating campaign locationID');
            campaign.locationID = room._id;
            return Q.all([ campaign, room, CampaignManager.update(campaign) ]);

        })
        .spread(function(campaign, room, campaignSavedResult) {

            return Q.all([ campaign, room ]);

        })
        .catch(function(err)
        {
            logger.error('Could not create room: ' + err);
            throw err;
        });

};


RoomManager.update = function (room) {

    var deferred = Q.defer();

    try
    {
        room.updated = new Date();

        var collection = db.get('rooms');

        collection.update({ _id: room._id }, room, function (err, doc) {

            if (err) {
                // it failed - return an error
                logger.error('Could not update room: ' + err);
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



module.exports = RoomManager;