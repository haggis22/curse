"use strict";

(function (app) {

    app.factory('Action', ['SkillType', 'diceService',

		function (SkillType, diceService) {

            // attacker and target are both of type Creature
            function Action(action) {

	            this.actor = action.actor;
                this.target = action.target;

                this.relevantSkills = [];
                this.speed = 0;

            };


		    Action.prototype = {

                getActor: function()
                {
                    return this.actor;
                },

                getTarget: function()
                {
                    return this.target;
                },

                getRelevantSkills: function() 
                {
                    return this.relevantSkills;
                },

                addRelevantSkill: function(skillID)
                {
                    this.relevantSkills.push(skillID);
                },

                getSpeed: function()
                {
                    return this.speed;
                },

		    };  // prototype

		    return (Action);

		}

	]);

})(angular.module('CurseApp'));




