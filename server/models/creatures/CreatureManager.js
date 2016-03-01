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

var Creature = require(__dirname + '/../../../js/creatures/Creature');

var SkillManager = require(__dirname + '/../skills/SkillManager');
var ItemManager = require(__dirname + '/../items/ItemManager');

var CreatureManager = function () {

};


CreatureManager.addItem = function (creature, item) {

    if (item.getWeight() + creature.getEncumbrance() > creature.getWeightAllowance()) {

        return { success: false, message: creature.getName(true) + ' cannot carry that much.' };

    }

    ItemManager.addToPile(creature.pack, item);

    return { success: true };

};


CreatureManager.dropItem = function (creature, itemID, amount) {

    var droppedItem = null;

    var remainingItems = [];

    for (var i = 0; i < creature.pack.length; i++) {

        if (creature.pack[i]._id != itemID) {
            remainingItems.push(creature.pack[i]);
        }

        else {

            if (amount == null) {
                // we haven't specified, so we're dropping it ALL
                amount = creature.pack[i].amount;
            }

            if (amount > creature.pack[i].amount) {
                return { success: false, message: creature.getName(true) + ' does not have enough ' + creature.pack[i].plural + ' to drop ' + amount };
            }

            if (creature.pack[i].amount > amount) {
                // subtract the parameter amount from his total, and keep the rest in his pack
                creature.pack[i].amount -= amount;

                // make sure he holds on to the remaining items
                remainingItems.push(creature.pack[i]);

                // re-create the item as the amount dropped
                droppedItem = ItemManager.cloneItem(item);
                droppedItem.amount = amount;
                droppedItem.equipped = false;

            }
            else {
                // drop the whole thing
                droppedItem = creature.pack[i];
                droppedItem.equipped = false;
            }

        }  // we found the item!

    }

    if (!droppedItem) {
        return { success: false, message: 'Is not carrying that item' };
    }

    creature.pack = remainingItems;
    return { success: true, item: droppedItem };

};

CreatureManager.pay = function (character, amount) {

    logger.debug('In CreatureManager.pay, amount = ' + amount);

    var money = character.countMoney();

    if (money < amount) {
        return Q.reject(new Error(character.getName(true) + ' does not have enough money.'));
    }

    var change = money - amount;

    logger.debug('Needs ' + change + ' change');

    // now drop all his money
    var remaining = [];

    for (var i = 0; i < character.pack.length; i++) {
        if (!character.pack[i].isCoin) {
            remaining.push(character.pack[i]);
        }
    }

    character.pack = remaining;

    return ItemManager.colorUp(change)

        .then(function (bags) {

            logger.debug('Getting back ' + bags.length + ' bags');

            for (var b = 0; b < bags.length; b++) {

                logger.debug('  Getting bag of ' + bags[b].amount + ' ' + bags[b].plural);
                debugger;
                var addResult = CreatureManager.addItem(character, bags[b]);
                if (!addResult.success) {
                    return Q.reject(new Error('Could not create change'));
                }

            }

            logger.debug('Done');

            return true;

        });


};




module.exports = CreatureManager;