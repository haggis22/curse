"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var uuid = require('node-uuid');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var User = require(__dirname + '/../../../js/users/User.js');
var Session = require(__dirname + '/../../../js/users/Session.js');

var UserManager = function () {
};

UserManager.fetch = function (query, callback) {

    var collection = db.get('users');

    collection.find(query, {}, function (err, result) {

        if (err) {
            logger.error('Could not load user from database for query ' + JSON.stringify(query) + ': ' + err);
            return callback(err, null);
        }

        if (result.length === 0) {
            // did not find a user with that username, but we don't want 
            // to tell them whether it is a wrong user or password
            return callback(null, null);
        }

        var user = new User(result[0]);

        return callback(null, user);

    });

};


UserManager.fetchByUsername = function (username, callback) {

    return UserManager.fetch({ username: username }, callback);

};


UserManager.fetchBySession = function (session, callback) {

    return UserManager.fetch({ session: session }, callback);

};


UserManager.login = function (username, password, callback) {

    UserManager.fetchByUsername(username, function (err, user) {

        if (err) {
            return callback(err, null);
        }

        if (user == null) {
            // Couldn't find a user with that username, but we don't want 
            // to tell them whether it is a wrong user or password
            return callback(null, null);
        }

        if (user.password !== password) {
            // the password is wrong, but we don't want 
            // to tell them whether it is a wrong user or password
            return callback(null, null);
        }

        // now generate their session id and save it
        user.session = uuid.v4();

        UserManager.update(user, function (err) {

            if (err) {
                logger.error('Could not assign session to logged-in user: ' + err);
                return callback(err, null);
            }

            // if we made it here then the user is valid and is now logged in
            // Create a session from their user object
            var session = new Session(user);
            return callback(null, session);

        });


    });

};


UserManager.create = function (user, callback) {

    user.updated = new Date();

    var collection = db.get('users');

    collection.insert(user, function (err, doc) {

        if (err) {

            // it failed - return an error
            logger.error('Could not create user: ' + err);
            return callback(err, null);
        }

        logger.info('User created successfully: ' + JSON.stringify(user));

        // pass the user back on a successful save
        return callback(null, user);

    });


};

UserManager.update = function (user, callback) {

    user.updated = new Date();

    var collection = db.get('users');

    collection.update({ _id: user._id }, user, function (err, doc) {

        if (err) {
            // it failed - return an error
            logger.error('Could not update user: ' + err);
            return callback(err, null);
        }

        logger.info('User updated successfully: ' + JSON.stringify(user));

        return callback(null, user);

    });


};



module.exports = UserManager;