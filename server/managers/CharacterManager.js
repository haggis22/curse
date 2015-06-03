"use strict";

var config = require('./../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');


var db = monk(config.db);

var dice = require('./../core/Dice.js');
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

CharacterManager.reroll = function (characterID, callback) {

    var myCallback = function (err, character) {

        if (err) {
            logger.error('Could not load character for re-roll: ' + err);
            return callback(err, null);
        }

        CharacterManager.rollCharacter(character);
        return CharacterManager.update(character, callback);

    };

    CharacterManager.fetchByID(characterID, myCallback);

};


CharacterManager.rollCharacter = function (character) {

    character.stats = {};

    switch (character.species) {

        case 'dwarf':
            character.stats.str = 13;
            character.stats.int = 7;
            character.stats.dex = 8;
            break;

        case 'elf':
            character.stats.str = 8;
            character.stats.int = 10;
            character.stats.dex = 10;
            break;

        case 'hobbit':
            character.stats.str = 7;
            character.stats.int = 8;
            character.stats.dex = 13;
            break;

        default:  // human, et al
            character.stats.str = 9;
            character.stats.int = 9;
            character.stats.dex = 9;
            break;
    }

    character.stats.health = Math.round((character.stats.str / 2) + (character.stats.dex / 2));
    character.stats.power = 0;
    character.stats.bonus = dice.averageDie(8, 12);

    character.maxStats = Creature.statsOrDefault(character.stats);

};


CharacterManager.create = function (character, callback) {

    CharacterManager.rollCharacter(character);

    character.updated = new Date();

    var collection = db.get('characters');

    collection.insert(character, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not create character: ' + err);
            return callback(err, null);
        }

        console.info('character saved successfully');

        return callback(null, { character: character });

    });


};

CharacterManager.update = function (character, callback) {

    character.updated = new Date();

    var collection = db.get('characters');

    collection.update({ _id: character._id }, character, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not update character: ' + err);
            return callback(err, null);
        }

        return callback(null, character);

    });


};



module.exports = CharacterManager;