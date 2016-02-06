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

var ItemFactory = require(__dirname + '/../../../js/items/ItemFactory');


var ItemTypeManager = function () {

};

var COLLECTION = 'items';

var types = 
{
    'melee-weapon': { type: 'weapon', hands: 1, skill: 'melee' },
    'sword': { base: 'melee-weapon', name: 'sword', article: 'a', weight: 10, value: 150000, attributes: [ 'steel' ], damage: { min: 3, max: 6 } },
    'missile-weapon': { type: 'weapon', hands: 2, skill: 'missile' },
    'bow': { base: 'missile-weapon', name: 'bow', article: 'a', weight: 3, value: 103000, attributes: [ 'wood' ], ammo: 'arrow' },
    'healing-potion': { type: 'potion', name: 'healing-potion', article: 'a', weight: 3, effect: 1, damage: { min: 3, max: 6 } },
    'helm': { type: 'armour', protects: 'head', damage: { min: 2, max: 3 }, weight: 7, value: 102000, attributes: [ 'steel' ] },
    'shield': { type: 'shield', hands: 1, skill: 'shield' },
    'buckler': { base: 'shield', name: 'buckler', article: 'a', weight: 8, value: 80005, damage: { min: 1, max: 2 } },
    'book': { type: 'item', weight: 2 }
};




module.exports = ItemTypeManager;