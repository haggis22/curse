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
var CreatureManager = require(__dirname + '/../creatures/CreatureManager');

var ItemManager = require(__dirname + '/../items/ItemManager');

var ShoppeManager = function () {

};

var COLLECTION = 'shoppe';



// returns an array of promises to resolve items by type
function loadItems(itemArray) {

    return Q.all(itemArray.map(function(item) { return ItemManager.lookupItem(item); }));

}

ShoppeManager.fetch = function () {

    var collection = db.get(COLLECTION);

    return Q.ninvoke(collection, "find", {}, {})

        .then(loadItems)

        .then(function(items) {
            return new Shoppe(items);

        })
        .catch(function(err) {
            
            logger.error('Error in fetch: ' + err.stack);
            throw err;

        })

};



// returns a fully-realized Item created by ItemManager.lookupItem
ShoppeManager.fetchItem = function (itemID) {

    var collection = db.get(COLLECTION);

    // this will return a promise to a single item
    return Q.ninvoke(collection, "find", { _id: itemID }, {})

        .then(function(result) {

            if (result.length == 0)
            {
                return Q.reject('Item not found');
            }

            return ItemManager.lookupItem(result[0]);

        });

};            // fetchItem



ShoppeManager.buy = function (user, characterID, itemID) {

    logger.debug('In ShoppeManager.buy for itemID ' + itemID);

    return Q.all([ CharacterManager.fetchByID(user, characterID), ShoppeManager.fetchItem(itemID) ])

        .spread(function (character, item) {

            logger.debug('Found character and item');

            return Q.all([ character, item, CreatureManager.pay(character, item.value) ]);

        })
        .spread(function(character, item, payResult) {

            logger.debug('Character paid for it');

            var addResult = CreatureManager.addItem(character, item);
            if (addResult)
            {
                // now save the character
                return CharacterManager.updatePack(character);
            }
            else
            {
                return Q.reject(new Error(addResult.message));
            }
            
        });

};


module.exports = ShoppeManager;