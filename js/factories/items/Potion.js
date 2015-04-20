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

            Potion.prototype.use = function(creature)
            {
                if (this.amount == 0)
                {
                    console.error(creature.getName(true) + " tried to drink, but the " + this.name + " is empty.");
                    return;
                }

                switch (this.effects.type)
				{
					case Potion.prototype.EFFECTS_HEAL:

                        var cure = creature.heal(diceService.rollDie(this.effects.damage.min, this.effects.damage.max));
						// gameService.actions.push('The potion cured you of ' + cure + ' damage');
						break;
							
				}  // end switch

                // TODO: change it from potion to empty bottle
                this.amount--;
                if (this.amount == 0)
                {
                    this.name = "empty flask";
                    this.article = "an";
                }

            };

    	    return (Potion);

		}

	]);

})(angular.module('CurseApp'));
