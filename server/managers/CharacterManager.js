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
            return callback(new Error('Unknown ID ' + id), null);
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
        // pass an empty adjustment object
        return CharacterManager.update(character, {}, callback);

    };

    CharacterManager.fetchByID(characterID, myCallback);

};


CharacterManager.rollCharacter = function (character) {

    character.stats = {};

    switch (character.species) {

        case 'dwarf':
            character.stats.str = 13;
            character.stats.dex = 8;
            character.stats.int = 7;
            character.stats.pie = 8;
            break;

        case 'elf':
            character.stats.str = 8;
            character.stats.int = 10;
            character.stats.dex = 10;
            character.stats.pie = 8;
            break;

        case 'hobbit':
            character.stats.str = 7;
            character.stats.int = 8;
            character.stats.dex = 13;
            character.stats.pie = 8;
            break;

        default:  // human, et al
            character.stats.str = 9;
            character.stats.int = 9;
            character.stats.dex = 9;
            character.stats.pie = 9;
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

CharacterManager.update = function (character, adjustment, callback) {

    // first, validate that the character's stat adjustments are legal
    // We need to pull the existing character
    CharacterManager.fetchByID(character._id, function (err, oldCharacter) {

        if (err) {
            // it failed - return an error
            logger.error('Could not verify character update: ' + err);
            return callback(err, null);
        }

        // add up the number of points
        var totalUpdates = 0;
        for (var prop in adjustment) {

            // only count upwards adjustments - we don't want anyone lowering a stat so that they
            // can raise another
            if ((adjustment.hasOwnProperty(prop)) && (adjustment[prop] > 0)) {
                totalUpdates += adjustment[prop];
            }
        }

        if (totalUpdates > 0) {

            if (totalUpdates > oldCharacter.stats.bonus) {
                logger.error('Character ' + character._id + ' tried to add ' + totalUpdates + ' worth of stats, but only has ' + oldCharacter.stats.bonus + ' available!');
                return callback(new Error('Allocated more stat points than are available'), null);
            }

            // passed validation, add the points to the stats and maxstats, and remove them from the bonus
            for (var prop in character.stats) {
                if ((character.stats.hasOwnProperty(prop)) && (oldCharacter.stats.hasOwnProperty(prop))) {
                    character.stats[prop] = oldCharacter.stats[prop] + (adjustment[prop] ? adjustment[prop] : 0);
                    character.maxStats[prop] = oldCharacter.maxStats[prop] + (adjustment[prop] ? adjustment[prop] : 0);
                }
            }

            character.stats.bonus = oldCharacter.stats.bonus - totalUpdates;

        }

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

    });



};



module.exports = CharacterManager;