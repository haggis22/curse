"use strict";

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

var ItemManager = require(__dirname + '/../items/ItemManager');
var TreasureManager = require(__dirname + '/../items/TreasureManager');


var RoomManager = function () {

};

var COLLECTION = 'rooms';

RoomManager.ID_TAVERN = 'tavern';


var rooms = 
[
	{ name: 'library', prep: 'in a', frequency: 1 },
	{ name: 'guardroom', prep: 'in a', frequency: 2, treasure: [ 'A', 'B', 'B' ] },
	{ name: 'bedroom', prep: 'in a', frequency: 2, treasure: [ 'A', 'B', 'B' ] },
	{ name: 'cave', prep: 'in a', frequency: 2, treasure: [ 'A', 'B', 'B' ] },
    { name: 'chapel', prep: 'in a', frequency: 1, treasure: [ 'A', 'B', 'B' ] },
    { name: 'stone chamber', prep: 'in a', frequency: 1, treasure: [ 'A', 'B', 'B' ] },
    { name: 'hall', prep: 'in a', frequency: 2, treasure: [ 'A', 'B', 'B' ] },
    { name: 'room with several tapestries hanging from the walls', prep: 'in a' , frequency: 0.5, treasure: [ 'A', 'B', 'B' ] },
    { name: 'dining room', prep: 'in a' , frequency: 2, treasure: [ 'A', 'B', 'B' ]},
    { name: 'dungeon', prep: 'in a', frequency: 2, treasure: [ 'A', 'B' ]},
    { name: 'maze', prep: 'wandering in a', frequency: 1, treasure: ['B']}
];


// Returns a promise to a room
RoomManager.fetchByID = function (campaign, roomID) {

    var deferred = Q.defer();

    var collection = db.get(COLLECTION);

    collection.find({ _id: roomID, campaignID: campaign._id }, function (err, result) {

        if (err) {
            logger.error('Could not load room from database: ' + err);
            return deferred.reject(err);
        }

        if (result.length == 0)
        {
            logger.warn('Could not find room ' + roomID + ' for campaign ' + campaign._id);
            return deferred.reject(new Error('Could not find room in campaign'));
        }

        var room = new Room(result[0]);
        return deferred.resolve(room);

    });

    return deferred.promise;

};     // fetchByID


function randomExitType()
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


// creates a random exit pointing to the given destination
function createExit(destinationID)
{
    var exit = new Exit();

    // since an exit is not a primary key, it will not get an automatic ID assigned to it, so 
    // create on manually so that we can refer to it when taking an exit
    exit._id = new ObjectID();

    exit.name = randomExitType();
    
    exit.destination = destinationID;
     
    return exit;

}


RoomManager.rollRoom = function(campaign, oldRoomID)
{
    logger.debug('In rollRoom for campaign ' + campaign._id + ', oldRoomID = ' + oldRoomID);

    var roomTemplate = dice.randomElement(rooms);

    var room = new Room(roomTemplate);

    room.campaignID = campaign._id;

    var numExits = dice.rollDie(1,2);

    for (var x=0; x < numExits; x++)
    {
        // create random exits that don't actually point anywhere yet
        room.exits.push(createExit(null));
    }

    // create an exit that points back to the old room
    room.exits.push(createExit(oldRoomID));

    logger.debug('rollRoom complete!');
    return Q.resolve(room)

        .then(function(room) {

            // if necessary, generate some items for the room
            if (roomTemplate.treasure)
            {
                return TreasureManager.generate(roomTemplate.treasure)

                    .then(function(treasure) {

                        ItemManager.addToPile(room.items, treasure);

                        return room;

                    });
                
            }
            else
            {
                console.log('Room has no treasure');
            }

            return room;

        });



}

RoomManager.create = function (campaign, oldRoomID) {

    if (oldRoomID == null)
    {
        oldRoomID = RoomManager.ID_TAVERN;
    }

    logger.debug('In RoomManager.create');

    return RoomManager.rollRoom(campaign, oldRoomID)

        .then(function(room) {

            logger.debug('RoomManager.create caught result of rollRoom');

            var deferred = Q.defer();

            room.updated = new Date();

            var collection = db.get(COLLECTION);

            logger.debug('Inserting new room into collection');

            collection.insert(room, function (err, doc) {

                if (err) {
                    // it failed - return an error
                    logger.error('Could not create room: ' + err);
                    return deferred.reject(new Error(err));
                }

                // return the newly-created room
                logger.debug('Resolving newly-created room');
                return deferred.resolve(new Room(doc));

            });  // collection.insert

            logger.debug('Returning room promise');
            return deferred.promise;

        })
        .catch(function(err)
        {
            logger.error('Could not create room: ' + err + '\nStack: ' + err.stack);
            throw err;
        });

};


RoomManager.update = function (room) {

    var deferred = Q.defer();

    try
    {
        room.updated = new Date();

        var collection = db.get(COLLECTION);

        collection.update({ _id: room._id }, room, function (err, doc) {

            if (err) {
                // it failed - return an error
                logger.error('Could not update room: ' + err);
                deferred.reject(new Error(err));
            }

            deferred.resolve({ success: true });

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