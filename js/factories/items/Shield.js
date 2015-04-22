"use strict";

(function (app) {

    app.factory('Shield', ['Item', 'BodyShape', 'diceService',

		function (Item, BodyShape, diceService) {

            function Shield(shield) {

                Item.call(this, shield);

                this.isShield = true;

                if (typeof shield.damage === 'number')
                {
                    this.damage = { min: shield.damage, max: shield.damage };
                }
                else 
                {
                    this.damage = shield.damage;
                }

            };

            Shield.prototype = Object.create(Item.prototype);

            Shield.prototype.use = function(creature)
            {
                // unequip any other shield the creature is using
                var items = creature.getItems();

                for (var i=0; i < items.length; i++)
                {
                    if (items[i].isShield)
                    {
                        items[i].equipped = false;
                    }
                }

                this.equipped = true;
            };

            Shield.prototype.getProtection = function()
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

            Shield.prototype.isEquippableBy = function(creature)
            {
                return creature.isShape([BodyShape.prototype.HUMANOID, BodyShape.prototype.WINGED_HUMANOID]) && creature.useWeapons;
            }
            
    	    return (Shield);

		}

	]);

})(angular.module('CurseApp'));
