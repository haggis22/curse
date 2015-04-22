"use strict";

(function (app) {

    app.factory('Weapon', ['Item', 'BodyShape', 'diceService',

		function (Item, BodyShape, diceService) {

            function Weapon(weapon) {

                Item.call(this, weapon);

                this.isWeapon = true;

                if (typeof weapon.damage === 'number')
                {
                    this.weapon = { min: weapon.damage, max: weapon.damage };
                }
                else 
                {
                    this.damage = weapon.damage;
                }

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
            
    	    return (Weapon);

		}

	]);

})(angular.module('CurseApp'));
