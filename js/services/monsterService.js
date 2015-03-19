"use strict";

(function(app) {

	app.service('monsterService', ['Monster', 'Sex', 'BodyShape', 'diceService', 'treasureService',
		function(Monster, Sex, BodyShape, diceService, treasureService) {

			this.monsters = [

                // name, species, bodyShape, article, sex, str, int, dex, health, isUndead, frequency, treasure, images
                new Monster({ species: 'goblin', str: 5, int: 4, dex: 10, health: 5, frequency: 15, treasure: ['A'], images: ['goblin1.jpg', 'goblin2.png']}),
                new Monster({ species: 'orc', article: 'an', str: 8, int: 5, dex: 11, health: 10, frequency: 15, treasure: ['A'], images: ['orc.png']}),
                new Monster({ species: 'troll', str: 13, int: 4, dex: 8, health: 15, frequency: 9, treasure: ['A','B'], images: ['troll.png']}),
                new Monster({ species: 'ogre', article: 'an', str: 14, int: 3, dex: 7, health: 17, frequency: 7, treasure: ['B'], images: ['ogre.png']}),
                new Monster({ species: 'skeleton', isUndead: true, str: 7, int: 0, dex: 9, health: 6, frequency: 14, treasure: ['E'], images: ['skeleton1.jpg', 'skeleton2.jpg', 'skeleton3.jpg']}),
                new Monster({ species: 'warlock', str: 10, int: 18, dex: 12, health: 18, frequency: 3, treasure: ['C'], images: ['warlock.png']}),
                new Monster({ species: 'scorchfire dragon', bodyShape: BodyShape.prototype.DRAGON, str: 18, int: 16, dex: 14, health: 22, frequency: 1, treasure: ['A','D'], images: ['dragon.png']}),
                new Monster({ species: 'giant serpent', bodyShape: BodyShape.prototype.SNAKE, str: 10, int: 0, dex: 8, health: 12, frequency: 8, images: ['serpent.png']}),
                new Monster({ species: 'demon', str: 20, int: 22, dex: 15, health: 24, frequency: 0.5, treasure: ['A','C'], images: ['demon.png']}),
                new Monster({ species: 'runty goblin', str: 2, int: 2, dex: 6, health: 4, frequency: 6, images: ['runty.png']})

			];

			this.randomMonster = function() {
				
				var monster = diceService.randomElement(this.monsters);
				
				// if he has a list of images, then choose one at random
				if (monster.images != null)
				{
					monster.image = monster.images[diceService.rollDie(0, monster.images.length - 1)];
				};
				
                // set up the monster's items - he may get to use some of them in combat
                for (var t=0; t < monster.treasure.length; t++)
                {
                    var item = treasureService.randomTreasure(monster.treasure[t]);
                    monster.pack.push(item);
                    
                    //TODO? Allow the monster to pick the best item
                    if (item.isEquippableBy(monster))
                    {
                        monster.useItem(item);
                    }

                }
				
                return monster;
				
			};


		}

	]);
	
}) (angular.module('CurseApp'));
	