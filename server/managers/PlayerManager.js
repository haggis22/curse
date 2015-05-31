"use strict";

var config = require('./../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');


var db = monk(config.db);

var Creature = require('./../models/creatures/Creature.js');

var players = [
    ];

var PlayerManager = function () {

};

PlayerManager.fetchAll = function (callback) {

    var collection = db.get('usercollection');

    var myPlayers = [];

    collection.find({}, {}, function (err, result) {

        if (err) {
            logger.error('Could not load players from database: ' + err);
            return callback(err, null);
        }

        for (var r = 0; r < result.length; r++) {
            myPlayers.push(new Creature(result[r]));
        }

        return callback(null, myPlayers);
    });

};

PlayerManager.fetchByName = function (name) {

    name = name.toLowerCase();

    for (var c = 0; c < players.length; c++) {
        if (players[c].name.toLowerCase() == name) {
            return players[c];
        }
    }

    return null;
};




module.exports = PlayerManager;