"use strict";

(function (app) {

    app.factory('Action', ['SkillType', 'diceService',

		function (SkillType, diceService) {

            // attacker and target are both of type Creature
            function Action(action) {

	            this.actor = action.actor;

                this.skills = {};

                this.speed = 0;

                this.isPhysical = false;

            };

            Action.prototype.isPhysicalAttack = function()
            {
                return this.isPhysical;
            };

		    Action.prototype.getRelevantSkills = function() 
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
            };

            Action.prototype.addRelevantSkill = function(skillName)
            {
                this.skills[skillName] = skillName;
            };

		    return (Action);

		}

	]);

})(angular.module('CurseApp'));




