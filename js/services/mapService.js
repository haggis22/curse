"use strict";

(function(app) {


	app.service('mapService', ['diceService', 'monsterService', 'Room', 'Exit', 'Direction',

		function(diceService, monsterService, Room, Exit, Direction) {

			this.rooms = [
				{ name: 'library', prep: 'in a', frequency: 1 },
				{ name: 'guardroom', prep: 'in a', frequency: 2 },
				{ name: 'bedroom', prep: 'in a', frequency: 2 },
				{ name: 'cave', prep: 'in a', frequency: 2 }
			];
			
			this.map = 
			[
				new Room('castle gate', 'at the', [ new Exit('a gate', Direction.prototype.NORTH, 1, false) ]),
				new Room('castle entryway', 'in the', [ new Exit('a gate', Direction.prototype.SOUTH, 0, false), new Exit('a door', Direction.prototype.NORTH, null, false) ])
			]
			
			this.currentRoomID = 0;
			this.currentRoom = this.map[this.currentRoomID];
			
			
			this.takeExit = function(exit)
			{
				if (exit.roomID == null)
				{
					// create a new room
					this.map.push(this.randomRoom(exit, this.currentRoomID));
					exit.roomID = this.map.length - 1;
				}
				
				// enter the next room
				this.currentRoomID = exit.roomID;
				this.currentRoom = this.map[this.currentRoomID];
				
			}
			
			
            this.randomExitDescription = function()
            {
                var rnd = Math.random();
                if (rnd < 0.3)
                {
                    return 'a door';
                }
                if (rnd < 0.5)
                {
                    return 'a doorway';
                }
                if (rnd < 0.7)
                {
                    return 'a hallway';
                }
                if (rnd < 0.8)
                {
                    return 'a passage';
                }
                if (rnd < 0.9)
                {
                    return 'a hall';
                }
                
                return 'an exit';
            }


			this.randomRoom = function(entry, lastRoomID) {
				
				var roomTemplate = diceService.randomElement(this.rooms);

				var room = new Room(roomTemplate.name, roomTemplate.prep, []);
				room.exits.push(new Exit(entry.desc, Direction.prototype.opposite(entry.dir), lastRoomID, false));

				for (var e=0; e < diceService.rollDie(1, 2); e++)
				{
					room.exits.push(new Exit(this.randomExitDescription(), Direction.prototype.randomDirection(), null, false));
				}
				
				if (Math.random() < 1.5)
				{
					room.monsters.push(monsterService.randomMonster());
				}
				
				return room;
				
			
			};


		}

	]);
	
}) (angular.module('CurseApp'));
	