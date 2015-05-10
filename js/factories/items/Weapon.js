"use strict";

(function (app) {

    app.factory('Weapon', ['Item', 'BodyShape', 'diceService',

		function (Item, BodyShape, diceService) {

            function Weapon(weapon) {

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

            };

            Weapon.prototype = Object.create(Item.prototype);

            Weapon.prototype.use = function(creature)
            {
                // remove any other item the creature is using that is considered a weapon
                var items = creature.getItems();

                for (var i=0; i < items.length; i++)
                {
                    if (items[i].isWeapon)
                    {
                        items[i].equipped = false;
                    }
                }

                this.equipped = true;
            };

            Weapon.prototype.isEquippableBy = function(creature)
            {
                return creature.isShape([BodyShape.prototype.HUMANOID, BodyShape.prototype.WINGED_HUMANOID]) && creature.useWeapons;
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


    	    return (Weapon);

		}

	]);

})(angular.module('CurseApp'));
