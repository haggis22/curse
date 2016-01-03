"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Q = require('q');

var Shoppe = require(__dirname + '/../../../js/shoppe/Shoppe');
var ItemFactory = require(__dirname + '/../../../js/items/ItemFactory');

var ShoppeManager = function () {

};

ShoppeManager.fetch = function () {

    var deferred = Q.defer();

    try {

        var collection = db.get('shoppe');

        var shoppe = {};

        collection.find({}, {}, function (err, result) {

            if (err) {
                logger.error('Could not load shoppe from database: ' + err);
                return deferred.reject(new Error(err));
            }

            if (result.length < 1) {
                logger.warn('No error, but no shoppe found in database');
                return deferred.resolve(new Shoppe());
            }

            return deferred.resolve(new Shoppe(result));
        });

    }
    catch (err) {
        logger.error('Error in fetch: ' + err);
        deferred.reject(new Error(err));
    }

    return deferred.promise;

};

ShoppeManager.fetchItem = function (itemID) {

    var deferred = Q.defer();

    try {

        var collection = db.get('shoppe');

        var item = {};

        // find(query, options, callback)
        collection.find({ _id: itemID }, {}, function (err, result) {

            if (err) {
                logger.error('Could not load item from database: ' + err);
                return deferred.reject(new Error(err));
            }

            if (result.length < 1) {
                logger.warn('No error, but item not found in database');
                return deferred.reject(new Error('Item not found'));
            }

            if (result.length > 1) {
                logger.warn('Found multiple items in the database');
                return deferred.reject(new Error('Multiple items found matching that ID'));
            }

            return deferred.resolve(ItemFactory.createItem(result[0]));
        });

    }
    catch (err) {
        logger.error('Error in fetchItem for item ' + itemID + ': ' + err);
        deferred.reject(new Error(err));
    }

    return deferred.promise;

};            // fetchItem



module.exports = ShoppeManager;