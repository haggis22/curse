"use strict";

(function(app) {

	app.factory('Player', ['Creature', 

		function(Creature) {

			function Player() {

                Creature.call(this, '');
			
			};
			
			Player.prototype = Object.create(Creature.prototype);

            Player.prototype.constructor = Player;

			return (Player);

		}

	]);
	
}) (angular.module('CurseApp'));
	