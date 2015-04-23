"use strict";

(function (app) {

    app.factory('WeaponAttack', ['AttackType',

		function (AttackType) {

		    function WeaponAttack(attack) 
            {
                AttackType.call(this, attack);

                this.weapon = attack.weapon;

                // all weapons will have even a default empty set of skills
                var weaponSkills = this.weapon.getSkills();

                for (var s=0; s < weaponSkills.length; s++)
                {
                    this.addRelevantSkill(weaponSkills[s]);
                }

		    };

            WeaponAttack.prototype = Object.create(AttackType.prototype);

            WeaponAttack.prototype.getDamage = function()
            {
                return this.weapon.damage;
            };

            WeaponAttack.prototype.getDescription = function(attack)
            {
                var desc = attack.actor.getName(true) + ' hit ' + attack.target.getName(true) + ' in the ' + attack.bodyPart.name + ' with ';
                if (this.weapon.article != '')
                {
                    desc += attack.actor.getPossessive() + ' ';
                }
                desc += this.weapon.getName()  + ' for ' + attack.damage + ' damage!';

                return desc;

            };

		    return (WeaponAttack);

		}

	]);

})(angular.module('CurseApp'));
	

