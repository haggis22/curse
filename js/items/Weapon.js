"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var WeaponModule = function (Item, BodyShape) {

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

        Weapon.prototype.isReady = function (attack) {

            var result = { success: true, messages: [] };

            // if this weapon does not require ammunition, then it is always ready
            if (!this.ammo) {
                return result;
            }

            var pack = attack.actor.getItems();

            for (var i = 0; i < pack.length; i++) {
                var item = pack[i];

                if (item.hasAttribute(this.ammo)) {
                    // we have at least one of the ammo required
                    // drop the ammo to the ground, and then return true
                    var dropResult = attack.actor.dropItem(item, 1);
                    if (!dropResult.success) {
                        // this will have success = false and hopefully a message about what went wrong
                        return dropResult;
                    }

                    if (Dice.rollDie(1, 100) < 20) {
                        // the ammo broken, so remove the attribute that was valuable and adjust its name
                        dropResult.item.removeAttribute(this.ammo);
                        dropResult.item.name += ' [broken]';
                        if (dropResult.item.stackable) {
                            dropResult.item.stackable.type += ' [broken]';
                            dropResult.item.stackable.plural += ' [broken]';
                        }

                    }

                    mapService.currentRoom.addItem(dropResult.item);

                    return result;

                }   // we have found an item of the right ammo type
            }

            return { success: false, messages: [attack.actor.getName(true) + ' cannot use ' + attack.actor.getPossessive() + ' ' + this.name + ' without ' + this.ammo] };

        };


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

        return Weapon;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Weapon', ['Item', 'BodyShape', WeaponModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = WeaponModule(
            require(__dirname + '/Item'),
            require(__dirname + '/../creatures/BodyShape')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
