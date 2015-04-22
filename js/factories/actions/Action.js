"use strict";

(function (app) {

    app.factory('Action', ['SkillType', 'diceService',

		function (SkillType, diceService) {

            // attacker and target are both of type Creature
            function Action(action) {

	            this.actor = action.actor;

                this.relevantSkills = [];
                this.speed = 0;

            };

		    Action.prototype.getRelevantSkills = function() 
            {
                return this.relevantSkills;
            };

            Action.prototype.addRelevantSkill = function(skillID)
            {
                this.relevantSkills.push(skillID);
            };

		    return (Action);

		}

	]);

})(angular.module('CurseApp'));




