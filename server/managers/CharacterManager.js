"use strict";

var config = require('./../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');


var db = monk(config.db);

var Creature = require('./../models/creatures/Creature.js');

var CharacterManager = function () {

};

CharacterManager.fetchAll = function (callback) {

    var collection = db.get('characters');

    var myCharacters = [];

    collection.find({}, {}, function (err, result) {

        if (err) {
            logger.error('Could not load characters from database: ' + err);
            return callback(err, null);
        }

        for (var r = 0; r < result.length; r++) {
            myCharacters.push(new Creature(result[r]));
        }

        return callback(null, myCharacters);
    });

};


CharacterManager.fetchByID = function (id, callback) {

    var collection = db.get('characters');

    collection.find({ _id: id }, function (err, result) {

        if (err) {
            logger.error('Could not load character from database: ' + err);
            return callback(err, null);
        }

        if (result.length == 0) {
            logger.error('Could not find record with id ' + id);
            return callback('Unknown ID ' + id, null);
        }

        return callback(null, new Creature(result[0]));
    });

};


CharacterManager.create = function (character, callback) {

    var collection = db.get('characters');

    collection.insert(character, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not create character: ' + err);
            return callback(err, null);
        }

        console.info('character saved successfully');

        return callback(null, 'Character ' + character.id + ' saved successfully');

    });


};

CharacterManager.update = function (character, callback) {

    var collection = db.get('characters');

    collection.update({ _id: character.id }, character, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not update character: ' + err);
            return callback(err, null);
        }

        console.info('character saved successfully');

        return callback(null, 'Character ' + character.id + ' saved successfully');

    });


};



module.exports = CharacterManager;