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

var Shoppe = require(__dirname + '/../../../js/shoppe/Shoppe');
var ItemFactory = require(__dirname + '/../../../js/items/ItemFactory');

var CharacterManager = require(__dirname + '/../creatures/CharacterManager');

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


ShoppeManager.buy = function (user, characterID, itemID) {

    logger.debug('In ShoppeManager.buy');

    return Q.all([ CharacterManager.fetchByID(user, characterID), ShoppeManager.fetchItem(itemID) ])

        .spread(function (character, item) {

            var cost = item.value.getCoppers();
            var money = character.countMoney();

            logger.debug('Item costs ' + cost + ' copper pieces');
            logger.debug(character.getName(true) + ' has ' + money + ' copper pieces!');

            // The item is not going to be a primary key, so it won't have its own ObjectID created automatically
            item._id = new ObjectID();

            logger.info('Is about to buy');

            var payResult = Shoppe.prototype.buyItem(character, item);

            logger.info('payResult = ' + JSON.stringify(payResult));

            if (payResult.success) {

                // the character successfully buys the item!
                return CharacterManager.updatePack(character)

                    .then(function(result) {
                                
                        return result;

                    })
                    .catch(function(err) {
                        logger.err('Could not save pack: ' + err);
                        throw err;
                    });

            }
            else {

                throw new Error(payResult.message);
            }

        })
        .catch(function(err) {
            logger.err('Could not buy:\n' + err.stack);
            throw err;
        });


};


module.exports = ShoppeManager;