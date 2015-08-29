"use strict";

(function(app) {

	app.service('playerService', [ 'Creature', 

		function(Creature) {

            var players = {};
            var currentPlayerID = null;

            this.getPlayers = function() {

                var array = [];

                for (var prop in players)
                {
                    if (players.hasOwnProperty(prop))
                    {
                        array.push(players[prop]);
                    }
                }
                return array;

            };

            this.addPlayer = function(creature) { 

                if (creature == null || creature._id == null)
                {
                    return;
                }

                players[creature._id] = creature;
            
            };

            this.setCurrentPlayerID = function(playerID) 
            {
                currentPlayerID = playerID;
            };

            this.getCurrentPlayerID = function()
            {
                return currentPlayerID;
            };

            this.getCurrentPlayer = function() {

                if (currentPlayerID == null || !players.hasOwnProperty(currentPlayerID))
                {
                    return null;
                }

                return players[currentPlayerID]

            };




		}


	]);
	
}) (angular.module('CurseApp'));
	