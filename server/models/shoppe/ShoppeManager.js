"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logconfig, {});
var logger = log4js.getLogger('curse');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var Shoppe = require(__dirname + '/Shoppe');


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

        return callback(null, new Shoppe(result[0]));
    });

};




module.exports = ShoppeManager;