"use strict";

(function (app) {

    app.factory('Room', ['diceService', 

		function (diceService) {

		    function Room(name, prep, exits, monsters, items) {
		        this.name = name;
                this.prep = prep;
                this.exits = exits;
                this.monsters = monsters == null ? [] : monsters;
                this.items = items == null ? [] : items;
		    };

		    Room.prototype = {

		        hasVisibleExits: function () {
                    for (var e = 0; e < this.exits.length; e++) {
                        if (!this.exits[e].isSecret) {
                            return true;
                        }
                    }

                    return false;
		        },

                hasMonsters: function () {

                    for (var m = 0; m < this.monsters.length; m++) {
                        if (this.monsters[m].isAlive()) {
                            return true;
                        }
                    }

                    return false;
                },

                hasDeadMonsters: function () {

                    for (var m = 0; m < this.monsters.length; m++) {
                        if (!this.monsters[m].isAlive()) {
                            return true;
                        }
                    }

                    return false;
                },

                randomExit: function() {

                    var exit = null;

                    while (exit == null)
                    {
                        // don't let them flee through a secret door
                        var door = diceService.rollDie(0, this.exits.length-1);
                        if (!this.exits[door].isSecret)
                        {
                            exit = this.exits[door];
                        }
                    }

                    return exit;

                },

                hasAnythingToSee: function() {

                    return ((this.items.length > 0) || (this.hasDeadMonsters()));
                }


		    };  // prototype

		    return (Room);

		}

	]);

})(angular.module('CurseApp'));

