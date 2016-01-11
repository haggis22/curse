"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var uuid = require('node-uuid');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Q = require('q');

var User = require(__dirname + '/../../../js/users/User.js');
var Session = require(__dirname + '/../../../js/users/Session.js');

var UserManager = function () {
};

UserManager.fetch = function (query) {

    var deferred = Q.defer();

    var collection = db.get('users');

    collection.find(query, {}, function (err, result) {

        if (err) {
            logger.error('Could not load user from database for query ' + JSON.stringify(query) + ': ' + err);
            return deferred.reject(err);
        }

        if (result.length === 0) {
            // did not find a user with that username, but we don't want 
            // to tell them whether it is a wrong user or password
            return deferred.resolve(null);
        }

        return deferred.resolve(new User(result[0]));

    });

    return deferred.promise;

};


UserManager.fetchByUsername = function (username) {

    // null username will mean NULL user
    if (username === null) {
        return Q.resolve(null);
    }

    return UserManager.fetch({ username: username });

};


UserManager.fetchBySession = function (sessionHash) {

    // null hash will mean NULL user
    if (sessionHash === null) {
        return Q.resolve(null);
    }

    return UserManager.fetch({ sessionHash: sessionHash });

};


UserManager.login = function (username, password) {

    return UserManager.fetchByUsername(username)

        .then(function (user) {

            // We don't want to tell them whether it is a wrong user or password
            if (user == null || user.password != password)
            {
                return null;
            }

            // now generate their session id and save it
            user.sessionHash = uuid.v4();

            return [user, UserManager.update(user)];
        })
        .spread(function(user, result) {
            
            if (result.success)
            {
                return new Session(user);
            }
            else
            {
                return null;
            }

        });

};


UserManager.create = function (user) {

    var deferred = Q.defer();

    user.updated = new Date();

    var collection = db.get('users');

    collection.insert(user, function (err, doc) {

        if (err) {

            // it failed - return an error
            logger.error('Could not create user: ' + err);
            return deferred.reject(err);
        }

        return deferred.resolve({ success: true });

    });

    return deferred.promise;

};


UserManager.update = function (user) {

    var deferred = Q.defer();

    user.updated = new Date();

    var collection = db.get('users');

    collection.update({ _id: user._id }, user, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not update user: ' + err);
            return deferred.reject(err);
        }

        return deferred.resolve({ success: true });

    });

    return deferred.promise;


};



module.exports = UserManager;