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


		    Action.prototype = {

                getActor: function()
                {
                    return this.actor;
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

                calculateSpeed: function() {

                    var msg = "Attack Speed, attacker: " + this.actor.getName(null) + ", dex: " + this.actor.dex;

                    var speedChance = this.actor.dex;
                    
                    var relevantSkills = this.getRelevantSkills();
                    for (var s=0; s < relevantSkills.length; s++)
                    {
                        var skillType = SkillType.prototype.getSkillType(relevantSkills[s]);
                        msg += ", " + skillType.getName() + ": " + this.actor.getSkillLevel(relevantSkills[s]);
                        speedChance += this.actor.getSkillLevel(relevantSkills[s]);
                    }

                    this.speed = diceService.averageDie(0, speedChance);
                    msg += ", TOTAL: " + speedChance + ", Roll: " + this.speed;
                    console.info(msg);

                }

		    };  // prototype

		    return (Action);

		}

	]);

})(angular.module('CurseApp'));




