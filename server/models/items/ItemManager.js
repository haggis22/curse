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

var dice = require(__dirname + '/../../core/Dice');

var Exit = require(__dirname + '/../../../js/maps/Exit');
var Room = require(__dirname + '/../../../js/maps/Room');

var Value = require(__dirname + '/../../../js/items/Value');

var Coin = require(__dirname + '/../../../js/items/Coin');
var Armour = require(__dirname + '/../../../js/items/Armour');
var Shield = require(__dirname + '/../../../js/items/Shield');
var Item = require(__dirname + '/../../../js/items/Item');
var Potion = require(__dirname + '/../../../js/items/Potion');
var Weapon = require(__dirname + '/../../../js/items/Weapon');

var ItemFactory = require(__dirname + '/../../../js/items/ItemFactory');


var ItemManager = function () {

};


var types =
{
    'item': { article: 'a', type: 'item', amount: 1 },
    'weapon': { type: Weapon.prototype.type, hands: 1 },
    'melee-weapon': { base: 'weapon', skill: 'melee' },
    'battle-axe': { name: 'battle axe', base: 'melee-weapon', weight: 15, value: 2000, attributes: ['edged'], damage: { min: 3, max: 8} },
    'sword': { name: 'sword', base: 'melee-weapon', weight: 10, value: 1500, attributes: ['steel', 'edged'], damage: { min: 3, max: 6} },
    'missile-weapon': { base: 'weapon', hands: 2, skill: 'missile' },
    'bow': { name: 'bow', base: 'missile-weapon', weight: 3, value: 1030, attributes: ['wood'], ammo: 'arrow' },
    'healing-potion': { name: 'healing potion', type: Potion.prototype.type, weight: 3, effect: 1, damage: { min: 3, max: 6} },
    'helm': { name: 'helm', type: Armour.prototype.type, protects: 'head', damage: { min: 2, max: 3 }, weight: 7, value: 1020, attributes: ['steel'] },
    'shield': { name: 'shield', type: Shield.prototype.type, hands: 1, weight: 10, value: 1000, damage: { min: 1, max: 3 }, skill: 'shield' },
    'buckler': { name: 'buckler', base: 'shield', weight: 8, value: 805, damage: { min: 1, max: 2} },
    'book': { name: 'book', weight: 2, value: 5 },
    'coin': { type: Coin.prototype.type, weight: 0.1 },
    'gold-piece': { name: 'gold piece', base: 'coin', value: 100, stack: 'gold-piece', plural: 'gold pieces' },
    'silver-piece': { name: 'silver piece', base: 'coin', value: 10, stack: 'silver-piece', plural: 'silver pieces' },
    'copper-piece': { name: 'copper piece', base: 'coin', value: 1, stack: 'copper-piece', plural: 'copper pieces' }
};


// returns a promise to a complete Item object created by ItemFactory
ItemManager.lookupItem = function (item) {

    if (!item || !item.type || !types.hasOwnProperty(item.type)) {
        return Q.resolve(null);
    }

    var typeStack = [];

    var type = types[item.type];
    while (type) {

        typeStack.push(type);
        if (type.hasOwnProperty('base') && types.hasOwnProperty(type.base)) {
            type = types[type.base];
        }
        else {
            type = null;
        }
    };

    // EVERYTHING inherits from item
    typeStack.push(types.item);

    var newItem = {};

    type = typeStack.pop();
    while (type) {

        for (var prop in type) {
            if (type.hasOwnProperty(prop)) {
                newItem[prop] = type[prop];
            }
        }

        type = typeStack.pop();

    }

    // some fields can be overridden. Anything besides the type, actually, 
    // because the basest "type" specifies which class to use, and that 
    // can be very different from the upper-level object that is originally
    // identified. We need the low-level object for ItemFactory to identify
    for (var prop in item) {
        if (item.hasOwnProperty(prop) && prop !== 'type') {
            newItem[prop] = item[prop];
        }
    }

    // if the item still doesn't have an ObjectID, let's give it one now
    item._id = new ObjectID();


    return Q.resolve(ItemFactory.createItem(newItem));


};

ItemManager.cloneItem = function (item) {

    var newItem = {};
    for (var prop in item) {
        if (item.hasOwnProperty(prop)) {
            newItem[prop] = item[prop];
        }
    }

    // give it a new ID though
    newItem._id = new ObjectID();

    return ItemFactory.createItem(newItem);

};


function convertToCoin(coinType, coppers) {

    return ItemManager.lookupItem({ type: coinType })

        .then(function (coins) {

            coins.amount = Math.floor(coppers / coins.value);
            var remainder = coppers - (coins.amount * coins.value);

            if (coins.amount == 0) {
                coins = null;
            }

            return Q.resolve([coins, remainder]);
        });
}


ItemManager.colorUp2 = function (coppers) {

    var moneyBags = [];

    return convertToCoin('gold-piece', coppers)

        .spread(function (gold, remainder) {
            if (gold) {
                moneyBags.push(gold);
            }

            return convertToCoin('silver-piece', remainder);
        })
        .spread(function (silver, remainder) {
            if (silver) {
                moneyBags.push(silver);
            }

            return convertToCoin('copper-piece', remainder);
        })
        .spread(function (copper, remainder) {

            if (copper) {
                moneyBags.push(copper);
            }

            return moneyBags;

        });

};

ItemManager.colorUp = function (coppers) {

    var amount = Value.colorUp(coppers);
    var bags = [];

    return ItemManager.lookupItem({ type: 'gold-piece' })

        .then(function(gold) {

            if (amount.gold > 0)
            {
                gold.amount = amount.gold;
                bags.push(gold);
            }

            return ItemManager.lookupItem({ type: 'silver-piece' });
        })
        .then(function(silver) {

            if (amount.silver > 0)
            {
                silver.amount = amount.silver;
                bags.push(silver);
            }

            return ItemManager.lookupItem({ type: 'copper-piece' });
        })
        .then(function(copper) {

            if (amount.copper > 0)
            {
                coppre.amount = amount.copper;
                bags.push(copper);
            }

            return bags;
        });

};

ItemManager.findStackmates = function (itemArray, item) {

    if (!item.isStackable()) {
        return null;
    }

    for (var i = 0; i < itemArray.length; i++) {
        if (itemArray.stack == item.stack) {
            return itemArray[i];
        }
    }

    return null;
};


module.exports = ItemManager;