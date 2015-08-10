"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');


var db = monk(config.db);

var dice = require(__dirname + '/../../core/Dice');

var Creature = require(__dirname + '/../../../js/creatures/Creature');

var SkillManager = require(__dirname + '/../skills/SkillManager');
var Item = require(__dirname + '/../../../js/items/Item');

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
            // return callback(new Error('Unknown ID ' + id), null);
            // no error, but no character, either
            return callback(null, null);
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

    character.pack = [];

    character.addItem(new Item({ name: 'gold piece', stackable: { type: 'gold', plural: 'gold pieces', amount: 50 }, attributes: ['gold'], weight: 0.1 }));

};


CharacterManager.create = function (character, callback) {

    var newCharacter = new Creature(character);

    CharacterManager.rollCharacter(newCharacter);

    newCharacter.updated = new Date();

    var collection = db.get('characters');

    collection.insert(newCharacter, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not create character: ' + err);
            return callback(err, null);
        }

        console.info('character saved successfully with id ' + doc._id);

        return CharacterManager.fetchByID(doc._id, callback);

    });


};


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

        for (var prop in character.skills) {

            if (character.skills.hasOwnProperty(prop)) {

                // First, check to see whether the character has added any skills
                if (!oldCharacter.skills.hasOwnProperty(prop)) {
                    // it's a new skill, so count its level as well as adjustments
                    totalSkillUpdates += character.skills[prop].value;
                 }

                // only count upwards adjustments - we don't want anyone lowering a stat so that they can raise another
                totalSkillUpdates += Math.max(0, character.skills[prop].adjust);
            }
        }

        console.log('totalSkillUpdates: ' + totalSkillUpdates);

        if (totalSkillUpdates > 0) {

            console.log('oldCharacter.bonus.skills = ' + oldCharacter.bonus.skills);

            if (totalSkillUpdates > oldCharacter.bonus.skills) {

                logger.error('Character ' + character._id + ' tried to add ' + totalSkillUpdates + ' worth of skills, but only has ' + oldCharacter.bonus.skills + ' available!');
                return callback(new Error('Allocated more skill points than are available'), null);
            }

        }

        // passed validation, add the points to the skills and maxskills, and remove them from the bonus
        for (var prop in character.skills) {
            if (character.skills.hasOwnProperty(prop)) {
                character.skills[prop].value = character.skills[prop].value + character.skills[prop].adjust;
                character.skills[prop].max = character.skills[prop].max + character.skills[prop].adjust;

                // clear out the adjustment
                character.skills[prop].adjust = 0;
            }
        }

        character.bonus.skills = oldCharacter.bonus.skills - totalSkillUpdates;

        // now verify that the character has all the necessary pre-requisites
        // First, fetch all skill data in one fell swoop
        SkillManager.fetchAll(function (err, allSkills) {

            if (err) {
                logger.error('Could not fetch skills in order to verify pre-requisites');
                return callback(err, null)
            }

            // now make sure that the character is eligible for any new skills
            for (var prop in character.skills) {

                if (character.skills.hasOwnProperty(prop)) {
                    if (!allSkills.hasOwnProperty(prop)) {
                        return callback(new Error('Could not verify skill ' + prop), null);
                    }

                    if (!oldCharacter.skills.hasOwnProperty(prop)) {
                        if (!SkillManager.isCharacterEligible(character, allSkills[prop])) {
                            return callback(new Error('Character is not eligible for skill ' + prop), null);
                        }
                    }
                }
            }


            // Passed all validation, now save the character!
            character.updated = new Date();

            var collection = db.get('characters');

            collection.update({ _id: character._id }, character, function (err, doc) {

                if (err) {
                    // it failed - return an error
                    logger.error('Could not update character: ' + err);
                    return callback(err, null);
                }

                return callback(null, character);

            });   // collection.update callback

        });  // SkillManager.fetchAll callback

    });  // oldCharacter.fetch callback


};


CharacterManager.savePack = function (character, callback) {

    // now save the character
    character.updated = new Date();

    var collection = db.get('characters');

    collection.update({ _id: character._id }, { $set: { 'pack': character.pack } }, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not update character: ' + err);
            return callback(err, null);
        }

        return callback(null, character);

    });   // collection.update callback

};



module.exports = CharacterManager;