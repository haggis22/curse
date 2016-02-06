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

        .then(ItemManager.lookupItem);

};            // fetchItem



ShoppeManager.buy = function (user, characterID, itemID) {

    logger.debug('In ShoppeManager.buy for itemID ' + itemID);

    return Q.all([ CharacterManager.fetchByID(user, characterID), ShoppeManager.fetchItem(itemID) ])

        .spread(function (character, item) {

            console.log('returned 2, item = ' + item);

            var money = character.countMoney();

            logger.debug('Item costs ' + item.value + ' copper pieces');
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