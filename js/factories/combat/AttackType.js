"use strict";

(function (app) {

    app.factory('AttackType', [

		function () {

		    function AttackType(attackType) 
            {
                this.skills = {};
                
                this.specialEffects = (attackType == null || attackType.specialEffects == null) ? [] : attackType.specialEffects;
		    };

            AttackType.prototype.getSkills = function()
            {
                var skills = [];

                for (var prop in this.skills)
                {
                    if (this.skills.hasOwnProperty(prop))
                    {
                        skills.push(this.skills[prop]);
                    }
                }

                return skills;
            }

            AttackType.prototype.addRelevantSkill = function(skillName)
            {
                this.skills[skillName] = skillName;
            };

            AttackType.prototype.checkEffects = function(attack, date)
            {
                var effects = [];

                for (var e=0; e < this.specialEffects.length; e++)
                {
                    effects = effects.concat(this.specialEffects[e].perform(attack, date));
                }

                return effects;

            };

            AttackType.prototype.toHitModifier = function(attack) 
            {
                return 0;
            };

            AttackType.prototype.damageModifier = function(attack) 
            {
                return 0;
            };

            AttackType.prototype.isReady = function(attack)
            {  
                return { success: true };
            }

            return (AttackType);

		}

	]);

})(angular.module('CurseApp'));
	

