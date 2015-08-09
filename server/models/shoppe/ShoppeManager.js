"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Shoppe = require(__dirname + '/../../../js/shoppe/Shoppe');
var Item = require(__dirname + '/../../../js/items/Item');

var ShoppeManager = function () {

};

ShoppeManager.fetch = function (callback) {

    var collection = db.get('shoppe');

    var shoppe = {};

    collection.find({}, {}, function (err, result) {

        if (err) {
            logger.error('Could not load shoppe from database: ' + err);
            return callback(err, null);
        }

        if (result.length < 1)
        {
            logger.warn('No error, but no shoppe found in database');
            return callback(null, new Shoppe());
        }

        return callback(null, new Shoppe(result));
    });

};

ShoppeManager.fetchItem = function (itemID, callback) {

    logger.debug('Searching for item ' + itemID + ' in the shoppe...');

    var collection = db.get('shoppe');

    var item = {};


    // find(query, options, callback)
    collection.find({ _id: itemID }, {}, function (err, result) {

        if (err) {
            logger.error('Could not load item from database: ' + err);
            return callback(err, null);
        }

        if (result.length < 1) {
            logger.warn('No error, but item not found in database');
            return callback(null, null);
        }

        if (result.length > 1) {
            logger.warn('Found multiple items in the database');
            return callback(new Error("Multiple items found matching that ID"), null);
        }

        return callback(null, new Item(result[0]));
    });

};    // fetchItem



module.exports = ShoppeManager;