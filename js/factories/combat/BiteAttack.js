"use strict";

(function (app) {

    app.factory('BiteAttack', ['AttackType',

		function (AttackType) {

		    function BiteAttack(bite) 
            {
                AttackType.call(this, bite);

                this.addRelevantSkill("melee");

                this.description = bite.description;

                if (typeof bite.damage === 'number')
                {
                    this.damage = { min: bite.damage, max: bite.damage };
                }
                else
                {
                    this.damage = bite.damage;
                }


		    };

            BiteAttack.prototype = Object.create(AttackType.prototype);

            BiteAttack.prototype.getDamage = function()
            {
                return this.damage;
            }

            BiteAttack.prototype.getDescription = function(attack)
            {
                return attack.actor.getName(true) + ' ' + this.description + ' ' + attack.target.getName(true) + ' in the ' + attack.bodyPart.name + ' for ' + attack.damage + ' damage!';
            }



		    return (BiteAttack);

		}

	]);

})(angular.module('CurseApp'));
	

