"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Q = require('q');

var Skill = require(__dirname + '/../../../js/skills/Skill.js');


var SkillManager = function () {

};

SkillManager.fetchAll = function () {

    var deferred = Q.defer();

    try
    {
        var collection = db.get('skills');

        collection.find({}, {}, function (err, result) {

            if (err) {
                logger.error('Could not load skills from database: ' + err);
                return deferred.reject(new Error(err));
            }

            var mySkills = {};

            for (var r = 0; r < result.length; r++) {

                // put it in the object with its name as the key
                mySkills[result[r].name] = result[r];
            }

            return deferred.resolve(mySkills);

        });
    }
    catch(err) {
        logger.error('Error in fetchAll: ' + err);
        deferred.reject(new Error(err));
    }

    return deferred.promise;

};


SkillManager.fetchByID = function (id) {

    var deferred = Q.defer();

    var collection = db.get('skills');

    collection.find({ _id: id }, function (err, result) {

        if (err) {
            logger.error('Could not load skills from database: ' + err);
            return deferred.reject(err);
        }

        if (result.length == 0) {
            logger.error('Could not find record with id ' + id);
            return deferred.resolve(null);
        }

        return deferred.resolve(new Skill(result[0]));
    });

    return deferred.promise;

};

SkillManager.fetchByName = function (name) {

    var deferred = Q.defer();

    var collection = db.get('skills');

    collection.find({ name: name }, function (err, result) {

        if (err) {
            logger.error('Could not load skill with name ' + name + ' from database: ' + err);
            return deferred.reject(err);
        }

        if (result.length == 0) {
            logger.error('Could not find skills with name ' + name);
            return deferred.resolve(null);
        }

        return deferred.resolve(new Skill(result[0]));
    });

    return deferred.promise;

};


SkillManager.create = function (skill) {

    var deferred = Q.defer();

    var collection = db.get('skills');

    collection.insert(skill, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not create skill: ' + err);
            return deferred.reject(err);
        }

        return deferred.resolve({ success: true });

    });

    return deferred.promise;


};

SkillManager.delete = function (skillID) {

    var deferred = Q.defer();

    var collection = db.get('skills');

    collection.remove({ _id: skillID }, { justOne: true }, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not delete skill: ' + err);
            return deferred.reject(err);
        }

        return deferred.resolve({ success: true });

    });

    return deferred.promise;

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