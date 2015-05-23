"use strict";

(function(app) {


	app.service('mapService', ['diceService', 'monsterService', 'Room', 'Exit', 'Direction', 'Item', 

		function(diceService, monsterService, Room, Exit, Direction, Item) {

			this.rooms = [
				{ name: 'library', prep: 'in a', frequency: 1 },
				{ name: 'guardroom', prep: 'in a', frequency: 2 },
				{ name: 'bedroom', prep: 'in a', frequency: 2 },
				{ name: 'cave', prep: 'in a', frequency: 2 },
                { name: 'chapel', prep: 'in a', frequency: 1 },
                { name: 'stone chamber', prep: 'in a', frequency: 1 },
                { name: 'hall', prep: 'in a', frequency: 2 },
                { name: 'room with several tapestries hanging from the walls', prep: 'in a' , frequency: 0.5},
                { name: 'dining room', prep: 'in a' , frequency: 2}
			];
			
			this.map = 
			[
				new Room({ name: 'castle gate', prep: 'at the', exits: [ new Exit('a gate', Direction.prototype.NORTH, 1, false) ], items: [ new Item({ name: 'gold piece', article: 'a', stackable: { type: 'gold', plural: 'gold pieces', amount: 12 }, attributes: [ 'gold' ], weight: 0.1 }) ] }),

				new Room({ name: 'castle entryway', prep: 'in the', exits: [ new Exit('a gate', Direction.prototype.SOUTH, 0, false), new Exit('a door', Direction.prototype.NORTH, null, false) ] })
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

				var room = new Room({ name: roomTemplate.name, prep: roomTemplate.prep });
				room.exits.push(new Exit(entry.desc, Direction.prototype.opposite(entry.dir), lastRoomID, false));

				for (var e=0; e < diceService.rollDie(1, 2); e++)
				{
					room.exits.push(new Exit(this.randomExitDescription(), Direction.prototype.randomDirection(), null, false));
				}
				
                var monsterTemplate = monsterService.randomMonster();

                room.monsters = monsterTemplate.spawn();
				
				return room;
				
			
			};


		}

	]);
	
}) (angular.module('CurseApp'));
	