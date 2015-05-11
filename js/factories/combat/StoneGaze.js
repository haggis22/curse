"use strict";

(function (app) {

    app.factory('StoneGaze', ['AttackType', 'diceService',

		function (AttackType, diceService) {

		    function StoneGaze(gaze) 
            {
                AttackType.call(this, gaze);

                this.isSpecialAttack = true;

		    };

            StoneGaze.prototype = Object.create(AttackType.prototype);

            StoneGaze.prototype.name = 'Stone Gaze';

            // returns an array of text descriptions of the attack and its effects
            StoneGaze.prototype.perform = function(attack)
            {
                var results = [];

                // don't stone someone that is already stoned!
                if (!attack.target.isStoned)
                {

                    // a paralyzed target cannot look away
                    if ((attack.target.isImmobilized) || (diceService.rollDie(1, 100) <= 20))
                    {
                        attack.target.isStoned = true;

                        results.push(attack.actor.getName(true) + ' gazed at ' + attack.target.getName(true) + ' and turned ' + attack.target.getObjective() + ' to stone!');
                    }
                    else
                    {
                        results.push(attack.actor.getName(true) + ' gazed at ' + attack.target.getName(true) + ', but ' + attack.target.getNominative() + ' turned ' + attack.target.getPossessive() + ' eyes away in time!');
                    }

                }

                return results;

            };


		    return (StoneGaze);

		}

	]);

})(angular.module('CurseApp'));
	

