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

var Creature = require(__dirname + '/../../../js/creatures/Creature');

var SkillManager = require(__dirname + '/../skills/SkillManager');
var ItemManager = require(__dirname + '/../items/ItemManager');

var CreatureManager = require(__dirname + '/CreatureManager');

var CharacterManager = function () {

};

var COLLECTION = 'characters';


// Returns a promise to a character
CharacterManager.fetchByID = function (user, id) {

    var deferred = Q.defer();

    var collection = db.get(COLLECTION);

    collection.find({ _id: id, userID: user._id }, function (err, result) {

        if (err) {
            logger.error('Could not load character from database: ' + err);
            deferred.reject(err);
        }

        var character = new Creature(result[0]);
        deferred.resolve(character);

    });

    return deferred.promise;

};     // fetchByID



// Returns a promise to an array of characters
CharacterManager.fetchByUser = function (user) {

    // we're not going to find any characters for a NULL user, so dump out now
    if (user == null) {
        return Q.resolve([]);
    }

    var deferred = Q.defer();

    var collection = db.get(COLLECTION);

    var myCharacters = [];

    collection.find({ userID: user._id }, {}, function (err, result) {

        if (err) {
            logger.error('Could not load characters from database: ' + err);
            return deferred.reject(err);
        }

        // turn the array of results to an array of Characters
        return deferred.resolve(result.map(function(row) { return new Creature(row); }));

    });

    return deferred.promise;

};   // fetchByUser

// Returns a promise to an array of characters that match the given campaign
CharacterManager.fetchByCampaign = function (user, campaign) {

    // we're not going to find any characters for a NULL user, so dump out now
    if (user == null || campaign == null) {
        return Q.resolve([]);
    }

    var deferred = Q.defer();

    var collection = db.get(COLLECTION);

    var myCharacters = [];

    collection.find({ userID: user._id, campaignID: campaign._id }, {}, function (err, result) {

        if (err) {
            logger.error('Could not load characters from database for campaign ' + campaign._id + ': ' + err);
            return deferred.reject(err);
        }

        // turn the array of results to an array of Characters
        return deferred.resolve(result.map(function(row) { return new Creature(row); }));

    });

    return deferred.promise;

};   // fetchByUser



function setStat(value) 
{
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

    // remove any skills they might have built up
    character.skills = {};

};


function insert(user, character) {

    character.updated = new Date();

    var collection = db.get(COLLECTION);

    return Q.ninvoke(collection, "insert", character)

        .then(function(doc) {
        
            return CharacterManager.fetchByID(user, doc._id);

        })
        .catch(function(err) {
            
            logger.error('Error in insert: ' + err.stack);
            throw err;

        })

}


CharacterManager.create = function (user, character) {

    var newCharacter = new Creature(character);
    newCharacter.userID = user._id;

    // this method is quick and synchronous
    CharacterManager.rollCharacter(newCharacter);

    // give him some gold to get him started
    return ItemManager.lookupItem({ _id: new ObjectID(), type: 'gold-piece', amount: 50 })

        .then(function(item) {

            var addResult = CreatureManager.addItem(newCharacter, item);

            return insert(user, newCharacter);

        });


};


CharacterManager.reroll = function (user, characterID) {

    var deferred = Q.defer();

    CharacterManager.fetchByID(user, characterID)

        .then(function(character) {
            
            CharacterManager.rollCharacter(character);

            CharacterManager.update(character._id, { stats: character.stats, health: character.health, bonus: character.bonus, skills: character.skills })
                .then(function(result) {
                    deferred.resolve(result);
                })
                .catch(function(err) {
                    deferred.reject(new Error(err));
                });

        })
        .catch(function(err) {
            return deferred.reject(new Error(err));
        });

    return deferred.promise;

};

CharacterManager.delete = function (user, characterID) {

    var deferred = Q.defer();

    try
    {
        CharacterManager.fetchByID(user, characterID)
            .then(function(character) {

                var collection = db.get(COLLECTION);

                collection.remove({ _id: characterID }, function (err, doc) {

                    if (err) {
                        // it failed - return an error
                        logger.error('Could not delete character: ' + err);
                        return deferred.reject(new Error(err));
                    }

                    // It worked!
                    return deferred.resolve({ success: true });

                });   // collection.remove

            })
            .catch(function(err) {
                return deferred.reject(new Error(err));
            });

    }
    catch (err)
    {
        logger.error('Error in delete: ' + err);
        deferred.reject(new Error(err));
    }

    return deferred.promise;


};



CharacterManager.saveStats = function (user, character) {

    var deferred = Q.defer();

    // first, validate that the character's stat adjustments are legal
    // We need to pull the existing character
    CharacterManager.fetchByID(user, character._id)

        .then(function(oldCharacter) {

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
                    return deferred.reject(new Error('Allocated more stat points than are available'));
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

                CharacterManager.update(character._id, { "bonus.stats": character.bonus.stats, "stats": character.stats })
                    .then(function(result) {

                        if (result.success)
                        {
                            return deferred.resolve(result);
                        }

                        return deferred.reject(new Error('Save stats failed'));

                    })
                    .catch(function(err) {
                        return deferred.reject(new Error(err));
                    });

            }
            else {

                // there wasn't really anything to do, so we're going to report success
                return deferred.resolve({ success: true });

            }


        })
        .catch(function(err) {
            logger.error('Could not verify character update: ' + err);
            return deferred.reject(new Error(err));
        });

    return deferred.promise;

};  // saveStats


CharacterManager.saveSkills = function (user, character) {

    var deferred = Q.defer();

    // first, validate that the character's skill adjustments are legal
    // We need to pull the existing character
    CharacterManager.fetchByID(user, character._id)

        .then(function(oldCharacter) {

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

            if (totalSkillUpdates > 0) {

                if (totalSkillUpdates > oldCharacter.bonus.skills) {

                    logger.error('Character ' + character._id + ' tried to add ' + totalSkillUpdates + ' worth of skills, but only has ' + oldCharacter.bonus.skills + ' available!');
                    return deferred.reject(new Error('Allocated more skill points than are available'));
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
                SkillManager.fetchAll()
                    .then(function(allSkills) {

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

                        CharacterManager.update(character._id, { "bonus.skills": character.bonus.skills, "skills": character.skills })
                            .then(function(result) {

                                if (result.success)
                                {
                                    return deferred.resolve(result);
                                }

                                return deferred.reject(new Error('Could not save skills'));

                            })
                            .catch(function(err) {
                                return deferred.reject(new Error(err));
                            });

                    })
                    .catch(function(err) {
                        return deferred.reject(new Error('Could not fetch skills in order to verify pre-reqs'));
                    });

            }
            else {
                // there wasn't really anything to do, so we're going to report success
                return deferred.resolve({ success: true });
            }

        })
        .catch(function(err) {
            return deferred.reject(new Error(err));
        });

    return deferred.promise;


};    // saveSkills




CharacterManager.update = function (characterID, newValues) {

    var deferred = Q.defer();

    newValues.updated = new Date();

    try
    {
        var collection = db.get(COLLECTION);

        collection.update({ _id: characterID }, { $set: newValues }, function (err, doc) {

            if (err) {
                // it failed - return an error
                logger.error('Could not update character: ' + err);
                return deferred.reject(new Error(err));
            }

            // It worked!
            return deferred.resolve({ success: true });

        });   // collection.update callback

    }
    catch (err)
    {
        logger.error('Error in update: ' + err);
        deferred.reject(new Error(err));
    }

    return deferred.promise;

}

CharacterManager.updatePack = function (character) {

    return CharacterManager.update(character._id, { pack: character.pack });

}

CharacterManager.joinCampaign = function(character, campaign) {

    // Check to see whether the character already belongs to a campaign
    if (character.campaignID)
    {
        if (character.campaignID == campaign._id)
        {
            Q.reject(new Error('Character is already in this campaign'));
        }

        Q.reject(new Error('Character is already in another campaign'));
    } 

    // mark the character as being part of this campaign
    return CharacterManager.update(character._id, { campaignID: campaign._id })
        .then(function(result) {
            return result;
        })
        .catch(function(err) { 
            logger.error('Character could not join campaign: ' + err);
            throw err;
        });

};

CharacterManager.quitCampaign = function(character, campaign) {

    // Check to see whether the character already belongs to a campaign
    if (!character.campaignID || (character.campaignID.toString() != campaign._id.toString()))
    {
        Q.reject(new Error('Character is not in this campaign'));
    } 

    // mark the character as not being in a campaign
    return CharacterManager.update(character._id, { campaignID: null })
        .then(function(result) {
            return result;
        })
        .catch(function(err) { 
            logger.error('Character could not quit campaign: ' + err);
            throw err;
        });

};



module.exports = CharacterManager;