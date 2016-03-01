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

var ItemManager = require(__dirname + '/ItemManager');


var TreasureManager = function () {

};

/*
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
*/

var types = 
{
    'A' : 
        [
            { frequency: 0, item: null },
            { frequency: 10, item: { type: 'gold-piece' }, amount: { min: 5, max: 20} },
            { frequency: 30, item: { type: 'silver-piece' }, amount: { min: 5, max: 20} },

        ],
    'B' :
        [
            { frequency: 0, item: null },
            { frequency: 40, item: { type: 'short-sword' } },
            { frequency: 40, item: { type: 'leather-armour' } }
        ]

};

/*
this.treasures =
			{
			    'A': [
                        new Item({ name: 'gold piece', article: 'a', stackable: { type: 'gold', plural: 'gold pieces', amount: { min: 5, max: 20} }, attributes: ['gold'], weight: 0.1 }),
                        new Armour({ name: 'magic codpiece', damage: 5, protects: BodyPart.prototype.GROIN, weight: 5 }),
                        new Armour({ name: 'steel underwear', article: '', damage: 3, protects: BodyPart.prototype.BUTT, weight: 5 }),
                        new Weapon({ name: 'club', damage: 2, skills: ['melee'], weight: 7 }),
                        new Weapon({ name: 'short sword', damage: 3, skills: ['melee', 'sword'], weight: 8 })
					  ],
			    'B': [
			    // B is weapons and armour
                        new Weapon({ name: 'broadsword', damage: 4, skills: ['melee', 'sword'], weight: 14 }),
                        new Weapon({ name: 'mace', damage: 3, skills: ['melee'], weight: 14 }),
                        new Armour({ name: 'breastplate', damage: 3, protects: BodyPart.prototype.TORSO, weight: 24 }),
                        new Armour({ name: 'helm', damage: 3, protects: BodyPart.prototype.HEAD, weight: 7 })
					  ],
			    'C': [
			    // C is magic treasure!
                        new Weapon({ name: 'Excalibur', article: '', damage: 6, skills: ['melee', 'sword'], weight: 12 }),
                        new Item({ type: Item.prototype.NECK, name: 'mystic talisman', weight: 1 }),
                        new Potion({ name: 'healing potion', effects: { type: Potion.prototype.EFFECTS_HEAL, damage: { min: 2, max: 4} }, amount: 1, weight: 3 })
					  ],
			    'D': [
                        new Item({ type: Item.prototype.WEALTH, name: 'jewels', article: '', amount: { min: 1, max: 3} }),
                        new Armour({ name: 'mithril armour', article: '', damage: 7, protects: BodyPart.prototype.TORSO, weight: 12 }),
                        new Weapon({ name: 'gilded sword', damage: 4, skills: ['melee', 'sword'], weight: 12, bonus: [{ hit: 15, damage: 5}] })
					  ],
			    'E': [
                        new Armour({ name: 'rusty chainmail', article: '', damage: 2, protects: BodyPart.prototype.TORSO, weight: 15 }),
                        new Shield({ name: 'cracked shield', damage: 1, weight: 12 }),
                        new Weapon({ name: 'bent knife', damage: 1, skills: ['melee'], weight: 2 })
					  ]
			};
*/

TreasureManager.randomTreasure = function (treasureType) {

    if (!types.hasOwnProperty(treasureType)) {
        return Q.reject(new Error('Unknown treasure type'));
    }

    var treasure = dice.randomElement(types[treasureType]);

    if (treasure.item == null) {

        // treasure came up empty
        console.log('treasure came up empty');
        return Q.resolve(null);
    }

    return ItemManager.lookupItem(treasure.item)

        .then(function (item) {

            if (treasure.amount) {

                item.amount = dice.rollDie(treasure.amount.min, treasure.amount.max);

            }

            return item;

        });

};      // randomTreasure

TreasureManager.generate = function (typeArray) {

    var treasurePromiseArray = typeArray.map(function (treasureType) { return TreasureManager.randomTreasure(treasureType); });

    return Q.all(treasurePromiseArray)

        .then(function (itemArray) {

            // we're going to use the ItemManager to generate the pile of treasure so that it might decide to consolidate various items
            var pile = [];

            for (var i = 0; i < itemArray.length; i++) {

                // The item could be null if the treasure manager decided not to roll up anything.
                // So if it's not null, then add it to the pile
                if (itemArray[i]) {
                    ItemManager.addToPile(pile, itemArray[i]);
                }

            }

            return pile;

        });


};   // generate




module.exports = TreasureManager;