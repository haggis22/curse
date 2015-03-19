"use strict";

(function(app) {

	app.factory('Player', ['Creature', 

		function(Creature) {

			function Player() {

                // start a player with a blank name and all defaults
                Creature.call(this, { name: '' });
			
			};
			
			Player.prototype = Object.create(Creature.prototype);

            Player.prototype.constructor = Player;

			return (Player);

		}

	]);
	
}) (angular.module('CurseApp'));
	