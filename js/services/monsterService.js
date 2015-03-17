"use strict";

(function(app) {

	app.service('monsterService', ['Monster', 'Sex', 'BodyShape', 'diceService', 'treasureService',
		function(Monster, Sex, BodyShape, diceService, treasureService) {

			this.monsters = [

                new Monster(null, 'goblin', BodyShape.prototype.HUMANOID, 'a', Sex.prototype.NEUTER, 5, 4, 10, 5, 15, ['A','A','B','B'], ['goblin1.jpg', 'goblin2.png']),
                new Monster(null, 'orc', BodyShape.prototype.HUMANOID, 'an', Sex.prototype.NEUTER, 8, 5, 11, 10, 12, ['A','A','B','B'], ['orc.png']),
                new Monster(null, 'troll', BodyShape.prototype.HUMANOID, 'a', Sex.prototype.NEUTER, 13, 4, 8, 15, 9, ['A','B'], ['troll.png']),
                new Monster(null, 'ogre', BodyShape.prototype.HUMANOID, 'an', Sex.prototype.NEUTER, 14, 3, 7, 17, 7, ['B'], ['ogre.png']),
                new Monster(null, 'skeleton', BodyShape.prototype.HUMANOID, 'a', Sex.prototype.NEUTER, 7, 0, 9, 6, 14, ['E'], ['skeleton1.jpg', 'skeleton2.jpg', 'skeleton3.jpg']),
                new Monster(null, 'warlock', BodyShape.prototype.HUMANOID, 'a', Sex.prototype.MALE, 18, 18, 12, 18, 3, ['C'], ['warlock.png']),
                new Monster(null, 'scorchfire dragon', BodyShape.prototype.DRAGON, 'a', Sex.prototype.NEUTER, 18, 16, 14, 22, 1, ['A','D'], ['dragon.png']),
                new Monster(null, 'serpent', BodyShape.prototype.SNAKE, 'a', Sex.prototype.NEUTER, 10, 0, 8, 12, 8, [], ['serpent.png']),
                new Monster(null, 'demon', BodyShape.prototype.HUMANOID, 'a', Sex.prototype.NEUTER, 20, 22, 15, 24, 0.5, ['C'], ['demon.png']),
                new Monster(null, 'runty goblin', BodyShape.prototype.HUMANOID, 'a', Sex.prototype.NEUTER, 2, 2, 6, 4, 6, [], ['runty.png'])

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
	