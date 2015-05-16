"use strict";

(function (app) {

    app.factory('Paralysis', ['diceService',

		function (diceService) {

		    function Paralysis(paralysis) 
            {
                this.chance = paralysis.chance;
                this.requiresDamage = paralysis.requiresDamage == null ? true : paralysis.requiresDamage;
		    };

            Paralysis.prototype = Object.create(Object.prototype);

            Paralysis.prototype.name = 'Paralysis';

            // returns an array of text descriptions of the attack and its effects
            Paralysis.prototype.perform = function(attack)
            {
                var result = { success: true, messages: [] };

                if (diceService.rollDie(1, 100) <= this.chance)
                {
                    if ((attack.damage > 0) || (!this.requiresDamage))
                    {
                        attack.target.isParalyzed = true;
                        result.messages.push(attack.actor.getName(true) + ' paralyzed ' + attack.target.getName(true) + '!');
                    }
                    else
                    {
                        result.messages.push(attack.actor.getName(true) + ' would have paralyzed ' + attack.target.getName(true) + ', but no damage was done...');
                    }

                }

                return result;

            };


		    return (Paralysis);

		}

	]);

})(angular.module('CurseApp'));
	

