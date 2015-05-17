"use strict";

(function (app) {

    app.factory('Potion', ['Item', 'diceService',

		function (Item, diceService) {

            function Potion(potion) {

                Item.call(this, potion);

                this.isPotion = true;
                
                this.effects = potion.effects;
                this.amount = potion.amount;

            };

            Potion.prototype = Object.create(Item.prototype);

            Potion.prototype.EFFECTS_HEAL = 1;
            Potion.prototype.EFFECTS_ANTIVENOM = 2;

            Potion.prototype.drainOnce = function()
            {
                
                this.amount--;
                if (this.amount == 0)
                {
                    this.name = "empty flask";
                    this.article = "an";
                }

            };

            Potion.prototype.use = function(creature)
            {

                if (this.amount == 0)
                {
                    return { success: false, message: creature.getName(true) + " tried to drink, but the " + this.name + " is empty." };
                }

                switch (this.effects.type)
				{
					case Potion.prototype.EFFECTS_HEAL:

                        var cure = creature.heal(diceService.rollDie(this.effects.damage.min, this.effects.damage.max));
                        this.drainOnce();
                        return { success: true, message: 'The potion cured ' + creature.getName(true) + ' of ' + cure + ' damage.' };
							
					case Potion.prototype.EFFECTS_ANTIVENOM:

                        creature.curePoison();
                        this.drainOnce();
                        return { success: true, message: 'The potion cured ' + creature.getName(true) + ' of poison.' };

                    default:
                        this.drainOnce();
                        return { success: false, message: 'Ahhh...refreshing!' };

				}  // end switch

            };

    	    return (Potion);

		}

	]);

})(angular.module('CurseApp'));
