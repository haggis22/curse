"use strict";

(function (app) {

    app.factory('CombatAction', 

		function () {

            // actor and target are both of type Creature
            function CombatAction(actionType, actor, target) {

	            this.actionType = actionType;
	            this.actor = actor;
	            this.target = target;

            };

		    CombatAction.prototype = {

                PHYSICAL_ATTACK: 1,

                isStillRequired: function()
                {
	                return (this.actor.isAlive()) && (this.target.isAlive());
                },

                getDescription: function()
                {
                    switch (this.actionType)
	                {
		                case this.PHYSICAL_ATTACK:
			                return this.actor.getName(true) + ' will attack ' + this.target.getName(true);
		
	                }  // actionType switch		
	
                },

                isPlayerAction: function (player) {

                    return this.actor == player;

                }

		    };  // prototype

		    return (CombatAction);

		}

	);

})(angular.module('CurseApp'));




