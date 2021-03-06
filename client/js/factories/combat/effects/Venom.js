"use strict";

(function (app) {

    app.factory('Venom', ['diceService',

		function (diceService) {

		    function Venom(venom) 
            {
                this.chance = venom.chance;
                this.damage = venom.damage;
                this.interval = venom.interval;
                this.requiresDamage = venom.requiresDamage == null ? true : venom.requiresDamage;
		    };

            Venom.prototype = Object.create(Object.prototype);

            Venom.prototype.name = 'Venom';

            // returns an array of text descriptions of the attack and its effects
            Venom.prototype.perform = function(attack, date)
            {
                var result = { success: true, messages: [] };

                if (diceService.rollDie(1, 100) <= this.chance)
                {
                    if ((attack.damage > 0) || (!this.requiresDamage))
                    {
                        attack.target.addPoison(this, date);
                        result.messages.push(attack.actor.getName(true) + ' poisoned ' + attack.target.getName(true) + '!');
                    }
                    else
                    {
                        result.messages.push(attack.actor.getName(true) + ' would have poisoned ' + attack.target.getName(true) + ', but no damage was done...');
                    }

                }

                return result;

            };


		    return (Venom);

		}

	]);

})(angular.module('CurseApp'));
	

