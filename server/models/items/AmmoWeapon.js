"use strict";

var Dice = require(__dirname + '/../../core/Dice');
var Weapon = require(__dirname + '/Weapon');
var BodyShape = require(__dirname + '/../creatures/BodyShape');
// var MapService

var AmmoWeapon = function(weapon) {

    Weapon.call(this, weapon);

    this.ammo = weapon.ammo;

};

AmmoWeapon.prototype = Object.create(Weapon.prototype);

AmmoWeapon.prototype.isReady = function(attack) 
{
    var result = { success: true, messages: [] };

    var pack = attack.actor.getItems();

    for (var i=0; i < pack.length; i++)
    {
        var item = pack[i];
        
        if (item.hasAttribute(this.ammo))
        {
            // we have at least one of the ammo required
            // drop the ammo to the ground, and then return true
            var dropResult = attack.actor.dropItem(item, 1);
            if (!dropResult.success)
            {
                // this will have success = false and hopefully a message about what went wrong
                return dropResult;
            }

            if (Dice.rollDie(1,100) < 20)
            {
                // the ammo broken, so remove the attribute that was valuable and adjust its name
                dropResult.item.removeAttribute(this.ammo);
                dropResult.item.name += ' [broken]';
                if (dropResult.item.stackable)
                {
                    dropResult.item.stackable.type += ' [broken]';
                    dropResult.item.stackable.plural += ' [broken]';
                }

            }

            mapService.currentRoom.addItem(dropResult.item);

            return result;

        }   // we have found an item of the right ammo type
    }

    return { success: false, messages: [ attack.actor.getName(true) + ' cannot use ' + attack.actor.getPossessive() + ' ' + this.name + ' without ' + this.ammo ] };

};


module.exports = AmmoWeapon;
