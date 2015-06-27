"use strict";

var Item = require('./Item');
var BodyShape = require(__dirname + '/../creatures/BodyShape');

var Weapon = function(weapon) {

    Item.call(this, weapon);

    this.isWeapon = true;

    if (typeof weapon.damage === 'number')
    {
        this.damage = { min: weapon.damage, max: weapon.damage };
    }
    else 
    {
        this.damage = weapon.damage;
    }

    if (weapon.skills == null)
    {
        this.skills = [];
    }
    else
    {
        this.skills = weapon.skills;
    }

    this.bonus = weapon.bonus == null ? [] : weapon.bonus;

    this.damageAdjustments = weapon.damageAdjustments == null ? [] : weapon.damageAdjustments;

    this.hands = weapon.hands == null ? 1 : weapon.hands;

};

Weapon.prototype = Object.create(Item.prototype);

Weapon.prototype.use = function(creature)
{
    // see how many hands free the character has
    var items = creature.getItems();

    var handsInUse = 0;

    for (var i=0; i < items.length; i++)
    {
        if ((items[i].equipped) && (!items[i].isWeapon))
        {
            handsInUse += items[i].hands;
        }
    }

    if (handsInUse + this.hands > creature.hands)
    {
        return { success: false, message: creature.getName(true) + ' does not have enough hands free to equip ' + this.getName(true) + '.' };
    }

    // unequip any other item the creature is using that is considered a weapon
    // TODO: allow other weapons to be equipped at the same time?
    for (var i=0; i < items.length; i++)
    {
        if (items[i].isWeapon)
        {
            items[i].equipped = false;
        }
    }

    this.equipped = true;

    return { success: true };
};

Weapon.prototype.isEquippableBy = function(creature)
{
    return creature.isShape([BodyShape.HUMANOID, BodyShape.WINGED_HUMANOID]) && creature.useWeapons;
}

Weapon.prototype.getSkills = function()
{
    return this.skills;
}
            
Weapon.prototype.toHitModifier = function(attack) 
{
    var modifier = 0;
    for (var b=0; b < this.bonus.length; b++)
    {
        var bonus = this.bonus[b];
        if (bonus.hit)
        {
            if (bonus.attr == null)
            {
                modifier += bonus.hit;
            }
            else
            {
                if (attack.target.hasAttribute(bonus.attr))
                {
                    modifier += bonus.hit;
                }
            }
                    
        }  // if weapon has a to-hit bonus
                
    }  // for each bonus

    return modifier;
};

Weapon.prototype.damageModifier = function(attack) 
{
    var modifier = 0;
    for (var b=0; b < this.bonus.length; b++)
    {
        var bonus = this.bonus[b];
        if (bonus.damage)
        {
            if (bonus.attr == null)
            {
                modifier += bonus.damage;
            }
            else
            {
                if (attack.target.hasAttribute(bonus.attr))
                {
                    modifier += bonus.damage;
                }
            }
                    
        }  // if weapon has a to-hit bonus
                
    }  // for each bonus

    return modifier;
};

Weapon.prototype.isReady = function(attack) {
    return { success: true };
};

module.exports = Weapon;
