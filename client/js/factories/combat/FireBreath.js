"use strict";

(function (app) {

    app.factory('FireBreath', ['AttackType', 'diceService',

		function (AttackType, diceService) {

		    function FireBreath(breath) 
            {
                AttackType.call(this, breath);

                this.isSpecialAttack = true;

                if (typeof breath.damage === 'number')
                {
                    this.damage = { min: breath.damage, max: breath.damage };
                }
                else
                {
                    this.damage = breath.damage;
                }

		    };

            FireBreath.prototype = Object.create(AttackType.prototype);

            FireBreath.prototype.name = 'Fire Breath';

            // returns an array of text descriptions of the attack and its effects
            FireBreath.prototype.perform = function(attack)
            {
                var result = { success: true, messages: [] };

                var roll = diceService.rollDie(1, 100);
                console.log("FireBreath die roll: " + roll);

                if (roll <= 20)
                {
                    var damage = diceService.rollDie(this.damage.min, this.damage.max);

                    result.messages.push(attack.actor.getName(true) + ' breathed fire at ' + attack.target.getName(true) + ' for ' + damage + ' damage');

					attack.target.health -= damage;
                    attack.target.checkHealth();

					if (!attack.target.isAlive())
					{
						result.messages.push(attack.actor.getName(true) + (attack.target.hasAttribute('undead') ? ' destroyed ' : ' killed ') + attack.target.getName(true) + '!');
					}

                }
                else
                {
                    result.messages.push(attack.actor.getName(true) + ' breathed fire at ' + attack.target.getName(true) + ', but ' + attack.target.getNominative() + ' managed to avoid the flames!');
                }

                return result;

            };


		    return (FireBreath);

		}

	]);

})(angular.module('CurseApp'));
	

