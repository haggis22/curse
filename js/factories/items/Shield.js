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

                this.hands = shield.hands == null ? 1 : shield.hands;

            };

            Shield.prototype = Object.create(Item.prototype);

            Shield.prototype.use = function(creature)
            {
                // see how many hands free the character has
                var items = creature.getItems();

                var handsInUse = 0;

                for (var i=0; i < items.length; i++)
                {
                    if ((items[i].equipped) && (!items[i].isShield))
                    {
                        handsInUse += items[i].hands;
                    }
                }

                if (handsInUse + this.hands > creature.hands)
                {
                    return { success: false, message: creature.getName(true) + ' does not have enough hands free to equip ' + this.getName(true) };
                }

                // unequip any other item the creature is using that is considered a shield
                for (var i=0; i < items.length; i++)
                {
                    if (items[i].isShield)
                    {
                        items[i].equipped = false;
                    }
                }

                this.equipped = true;

                return { success: true };


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
