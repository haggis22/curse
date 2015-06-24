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
        return CharacterManager.update(character, callback);

    };

    CharacterManager.fetchByID(characterID, myCallback);

};


function setStat(value) {

    return { value: value, max: value, adjust: 0 };

};

function setStats(str, dex, int, pie)
{
    return { str: setStat(str), dex: setStat(dex), int: setStat(int), pie: setStat(pie) };
}

CharacterManager.rollCharacter = function (character) {

    switch (character.species) {

        case 'dwarf':
            character.stats = setStats(13, 8, 7, 8);
            break;

        case 'elf':
            character.stats = setStats(8, 10, 10, 8);
            break;

        case 'hobbit':
            character.stats = setStats(7, 13, 8, 8);
            break;

        default:  // human, et al
            character.stats = setStats(9, 9, 9, 9);
            break;
    }

    character.health = setStat(Math.round((character.stats.str.value / 2) + (character.stats.dex.value / 2)));
    character.bonus = 
    {
        stats: dice.averageDie(8, 12),
        skills: 10
    };

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

        console.info('character saved successfully with id ' + doc._id);

        return CharacterManager.fetchByID(doc._id, callback);

    });


};


CharacterManager.isSkillEligible = function(character) {

}


CharacterManager.update = function (character, callback) {

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
        for (var prop in character.stats) {

            // only count upwards adjustments - we don't want anyone lowering a stat so that they
            // can raise another
            if ((character.stats.hasOwnProperty(prop)) && (character.stats[prop].adjust > 0)) {
                totalUpdates += character.stats[prop].adjust;
            }
        }

        if (totalUpdates > 0) {

            if (totalUpdates > oldCharacter.bonus.stats) {
                logger.error('Character ' + character._id + ' tried to add ' + totalUpdates + ' worth of stats, but only has ' + oldCharacter.bonus.stats + ' available!');
                return callback(new Error('Allocated more stat points than are available'), null);
            }

            // passed validation, add the points to the stats and maxstats, and remove them from the bonus
            for (var prop in character.stats) {
                if ((character.stats.hasOwnProperty(prop)) && (oldCharacter.stats.hasOwnProperty(prop))) {
                    character.stats[prop].value = oldCharacter.stats[prop].value + character.stats[prop].adjust;
                    character.stats[prop].max = oldCharacter.stats[prop].value + character.stats[prop].adjust;

                    // clear out the adjustment
                    character.stats[prop].adjust = 0;
                }
            }

            character.bonus.stats = oldCharacter.bonus.stats - totalUpdates;

        }

        // now validate the skills
        var totalSkillUpdates = 0;



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