"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Q = require('q');

var dice = require(__dirname + '/../../core/Dice');

var Room = require(__dirname + '/../../../js/maps/Room');

var ItemFactory = require(__dirname + '/../../../js/items/ItemFactory');

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
RoomManager.fetchByID = function (id) {

    var deferred = Q.defer();

    var collection = db.get('rooms');

    collection.find({ _id: id }, function (err, result) {

        if (err) {
            logger.error('Could not load room from database: ' + err);
            deferred.reject(err);
        }

        var room = new Room(result[0]);
        deferred.resolve(room);

    });

    return deferred.promise;

};     // fetchByID


RoomManager.rollRoom = function()
{
    var room = new Room(dice.randomElement(rooms));

    return room;
}

RoomManager.create = function () {

    var deferred = Q.defer();

    // this method is quick and synchronous
    var room = RoomManager.rollRoom();

    room.updated = new Date();

    var collection = db.get('rooms');

    collection.insert(room, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not create room: ' + err);
            return deferred.reject(new Error(err));
        }

        // fetch the newly-created room and use that to resolve/reject the outer promise
        RoomManager.fetchByID(doc._id)
            .then(function(room) {
                return deferred.resolve(room);
            })
            .catch(function(err) {
                return deferred.reject(new Error(err));
            });

    });

    return deferred.promise;

};




module.exports = RoomManager;