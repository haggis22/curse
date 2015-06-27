"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Skill = require(__dirname + '/Skill.js');


var SkillManager = function () {

};

SkillManager.fetchAll = function (callback) {

    var collection = db.get('skills');

    collection.find({}, {}, function (err, result) {

        if (err) {
            logger.error('Could not load skills from database: ' + err);
            return callback(err, null);
        }

        var mySkills = {};

        for (var r = 0; r < result.length; r++) {

            // put it in the object with its name as the key
            mySkills[result[r].name] = result[r];
        }

        return callback(null, mySkills);
    });

};


SkillManager.fetchByID = function (id, callback) {

    var collection = db.get('skills');

    collection.find({ _id: id }, function (err, result) {

        if (err) {
            logger.error('Could not load skills from database: ' + err);
            return callback(err, null);
        }

        if (result.length == 0) {
            logger.error('Could not find record with id ' + id);
            return callback(new Error('Unknown ID ' + id), null);
        }

        return callback(null, new Skill(result[0]));
    });

};

SkillManager.fetchByName = function (name, callback) {

    var collection = db.get('skills');

    collection.find({ name: name }, function (err, result) {

        if (err) {
            logger.error('Could not load skill with name ' + name + ' from database: ' + err);
            return callback(err, null);
        }

        if (result.length == 0) {
            logger.error('Could not find skills with name ' + name);
            return callback(new Error('Unknown Skill named ' + name), null);
        }

        return callback(null, new Skill(result[0]));
    });

};


SkillManager.create = function (skill, callback) {

    var collection = db.get('skills');

    collection.insert(skill, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not create skill: ' + err);
            return callback(err, null);
        }

        console.info('skill saved successfully');

        return callback(null, { skill: skill });

    });


};

SkillManager.delete = function (skillID, callback) {

    var collection = db.get('skills');

    collection.remove({ _id: skillID }, { justOne: true }, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not delete skill: ' + err);
            return callback(err, null);
        }

        console.info('skill deleted successfully');

        return callback(null, 'Skill ' + skillID + ' deleted successfully');

    });


};

SkillManager.hasPreReqs = function(character, reqs, mapName)
{
    for (var prop in reqs)
    {
        if (reqs.hasOwnProperty(prop))
        {
            // if the character doesn't have that stat/skill at all, or is too low, then fail him out
            if (!character[mapName] || !character[mapName].hasOwnProperty(prop) || character[mapName][prop].value < reqs[prop])
            {
                return false;
            }

        }
                    
    }  // for each pre-req

    return true;



}


SkillManager.isCharacterEligible = function(character, skill) {

    if (!skill.prereqs)
    {
        // skill has no pre-requisites at all
        return true;
    }

    return SkillManager.hasPreReqs(character, skill.prereqs.stats, 'stats') && SkillManager.hasPreReqs(character, skill.prereqs.skills, 'skills');

};



module.exports = SkillManager;