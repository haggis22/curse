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
    'battle-axe': { base: 'melee-weapon', weight: 15, value: 2000, attributes: ['edged'], damage: { min: 3, max: 8} },
    'sword': { base: 'melee-weapon', weight: 10, value: 1500, attributes: ['steel', 'edged'], damage: { min: 3, max: 6} },
    'missile-weapon': { base: 'weapon', hands: 2, skill: 'missile' },
    'bow': { base: 'missile-weapon', weight: 3, value: 1030, attributes: ['wood'], ammo: 'arrow' },
    'healing-potion': { type: Potion.prototype.type, weight: 3, effect: 1, damage: { min: 3, max: 6} },
    'helm': { type: Armour.prototype.type, protects: 'head', damage: { min: 2, max: 3 }, weight: 7, value: 1020, attributes: ['steel'] },
    'shield': { type: Shield.prototype.type, hands: 1, weight: 10, value: 1000, damage: { min: 1, max: 3 }, skill: 'shield' },
    'buckler': { base: 'shield', weight: 8, value: 805, damage: { min: 1, max: 2} },
    'book': { weight: 2, value: 5 },
    'coin': { weight: 0.1 },
    'gold-piece': { base: 'coin', value: 100, plural: 'gold pieces' },
    'silver-piece': { base: 'coin', value: 10, plural: 'silver pieces' },
    'copper-piece': { base: 'coin', value: 1, plural: 'copper pieces' }
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

    var item =
    {
        _id: item._id,
        name: item.name
    };

    type = typeStack.pop();
    while (type) {

        for (var prop in type) {
            if (type.hasOwnProperty(prop)) {
                item[prop] = type[prop];
            }
        }

        type = typeStack.pop();

    }

    return Q.resolve(ItemFactory.createItem(item));


};



module.exports = ItemManager;