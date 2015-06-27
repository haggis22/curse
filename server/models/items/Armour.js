"use strict";

var Item = require('./Item');
var BodyShape = require(__dirname + '/../creatures/BodyShape');

var Armour = function(armour) {

    Item.call(this, armour);

    this.isArmour = true;

    if (typeof armour.damage === 'number')
    {
        this.damage = { min: armour.damage, max: armour.damage };
    }
    else 
    {
        this.damage = armour.damage;
    }

    this.protects = armour.protects;
	
};

Armour.prototype = Object.create(Item.prototype);

Armour.prototype.use = function(creature)
{
    // remove any other item the creature is using that protects the same
    var items = creature.getItems();

    for (var i=0; i < items.length; i++)
    {
        if (items[i].isArmour && items[i].protects == this.protects)
        {
            items[i].equipped = false;
        }
    }

    this.equipped = true;

    return { success: true };
};

Armour.prototype.getProtection = function()
{
    if (typeof this.damage === 'number')
    {
        return this.damage;
    }
    else
    {
        return diceService.rollDie(this.damage.min, this.damage.max);
    }

};

Armour.prototype.isEquippableBy = function(creature)
{
    return creature.isShape([BodyShape.HUMANOID, BodyShape.WINGED_HUMANOID]) && creature.useArmour;
}


module.exports = Armour;
