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


var ItemTypeManager = function () {

};


var types = 
{
    'item': { article: 'a', type: 'item' },
    'weapon': { type: Weapon.prototype.type, hands: 1 },
    'melee-weapon': { base: 'weapon', skill: 'melee' },
    'sword': { base: 'melee-weapon', name: 'sword', weight: 10, value: 150000, attributes: [ 'steel' ], damage: { min: 3, max: 6 } },
    'missile-weapon': { base: 'weapon', hands: 2, skill: 'missile' },
    'bow': { base: 'missile-weapon', name: 'bow', weight: 3, value: 103000, attributes: [ 'wood' ], ammo: 'arrow' },
    'healing-potion': { type: Potion.prototype.type, name: 'healing potion', weight: 3, effect: 1, damage: { min: 3, max: 6} },
    'helm': { type: Armour.prototype.type, name: 'helm', protects: 'head', damage: { min: 2, max: 3 }, weight: 7, value: 102000, attributes: ['steel'] },
    'shield': { type: Shield.prototype.type, name: 'shield', hands: 1, skill: 'shield' },
    'buckler': { base: 'shield', name: 'buckler', weight: 8, value: 80005, damage: { min: 1, max: 2 } },
    'book': { name: 'book', weight: 2 }
};


ItemTypeManager.lookupItem = function (typeName) {

    if (!types.hasOwnProperty(typeName)) {
        return Q.resolve(null);
    }

    var typeStack = [];

    var type = types[typeName];
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

    var item = {};

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



module.exports = ItemTypeManager;