"use strict";

(function (app) {

    app.factory('CombatAction', ['SkillType', 

		function (SkillType) {

            // attacker and target are both of type Creature
            function CombatAction(actionType, attacker, target) {

	            this.actionType = actionType;
	            this.attacker = attacker;
	            this.target = target;

            };

		    CombatAction.prototype = {

                PHYSICAL_ATTACK: 1,

                isStillRequired: function()
                {
	                return (this.attacker.isAlive()) && (this.target.isAlive());
                },

                getDescription: function()
                {
                    switch (this.actionType)
	                {
		                case this.PHYSICAL_ATTACK:
			                return this.attacker.getName(true) + ' will attack ' + this.target.getName(true);
		
	                }  // actionType switch		
	
                },

                isPlayerAction: function (player) {

                    return this.attacker == player;

                },

                getActionType: function() {
                    return this.actionType;
                },

                getRelevantSkills: function() {
                    
                    switch (this.getActionType())
                    {
                        case this.PHYSICAL_ATTACK:
                            return [ SkillType.prototype.ID_MELEE ];

                    }

                    return [];
                }

		    };  // prototype

		    return (CombatAction);

		}

	]);

})(angular.module('CurseApp'));




