"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var PotionModule = function (Item) {

        var Potion = function(potion) {

            Item.call(this, potion);

            this.isPotion = true;
                
            this.effects = potion.effects;
            this.amount = potion.amount;

        };

        Potion.prototype = Object.create(Item.prototype);

        Potion.prototype.type = 'potion';

        Potion.EFFECTS =
        {
            HEAL: 1,
            ANTIVENOM: 2
        };


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

            this.drainOnce();

            switch (this.effects.type)
	        {
		        case Potion.EFFECTS.HEAL:
                    var cure = creature.heal(Dice.rollDie(this.effects.damage.min, this.effects.damage.max));
                    return { success: true, message: 'The potion cured ' + creature.getName(true) + ' of ' + cure + ' damage.' };
							
		        case Potion.EFFECTS.ANTIVENOM:
                    creature.curePoison();
                    return { success: true, message: 'The potion cured ' + creature.getName(true) + ' of poison.' };

                default:
                    return { success: true, message: 'Ahhh...refreshing!' };

	        }  // end switch

        };

        return Potion;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Potion', ['Item', PotionModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = PotionModule(
            require(__dirname + '/Item')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
